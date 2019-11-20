require 'net/http'  # for GET request
require 'json'
require 'rest-client'

class CalendarController < ApplicationController
  def index
    client = Signet::OAuth2::Client.new(clientOptions)
    client.update!(session[:authorization])

    service = Google::Apis::CalendarV3::CalendarService.new
    service.authorization = client

    # this is kinda stupid, I don't really know another way lmao
    @calendars = service.list_calendar_lists.items
    calendar_ids = get_list_of_cal_ids(@calendars)

    access_token = client.access_token
    json_response = get_json_from_token(access_token)
    freebusy_times = get_freebusy_response(access_token, calendar_ids)["calendars"]

    @busy_times = get_list_of_times(freebusy_times)
    # find or build the user
    @user = find_or_create_user(session[:user_type], json_response["name"], json_response["email"])
    @free_times = get_free_times(@busy_times)
  end

  def user_selection
  end

  def events
    client = Signet::OAuth2::Client.new(clientOptions)
    client.update!(session[:authorization])

    service = Google::Apis::CalendarV3::CalendarService.new
    service.authorization = client

    @events = service.list_events(params[:calendar_id]).items
  end
  
  def callback
    client = Signet::OAuth2::Client.new(clientOptions)
    client.code = params[:code]
    response = client.fetch_access_token!
    session[:authorization] = response

    redirect_to '/calendar'
  end

	private
  
  # for returning JSON response
  def get_json_from_token(access_token)
    uri = URI.parse('https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token='+access_token)
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true
    http.verify_mode = OpenSSL::SSL::VERIFY_NONE # You should use VERIFY_PEER in production
    request = Net::HTTP::Get.new(uri.request_uri)
    response = http.request(request)
    JSON(response.body)
  end

  def get_freebusy_response(access_token, calendar_ids)
    # make request from today to two weeks after
    items = []
    calendar_ids.each do |id|
      items << {"id": id}
    end
    response = RestClient.post 'https://www.googleapis.com/calendar/v3/freeBusy?alt=json&access_token='+access_token,
      {
        "timeMin": (Time.now.localtime.beginning_of_day + 9.hours).rfc3339,
        "timeMax": (Time.now.localtime.beginning_of_day + 14.days).rfc3339,
        "items": items,
      }.to_json,
      :content_type => :json
    JSON(response.body)
  end

  def get_list_of_times(freebusy_response)
    answer = []
    freebusy_response.each do |key,value|
      value.each do |a,b|
        b.each do |s|
          answer << s
        end
      end
    end
    answer
  end

  def get_list_of_cal_ids(calendars)
    answer = []
    calendars.each do |c|
      answer << c.id
    end
    answer
  end

  def get_free_times(times)
    # try to find a free one hour session today 9am-5pm
    goodTimes = []
    (0..14).each do |day|
      starting_day = Time.now.localtime.beginning_of_day + day.days
      (0..8).each do |hour|
        temp_time = starting_day + (9 + hour).hours
        temp_time_one_hour = starting_day + (10 + hour).hours
        # now loop through times
        viable = true
        times.each do |hash|
          if hash.member?("start")
            # there is a start time
            start_time = Time.parse(hash["start"]).localtime
            end_time = Time.parse(hash["end"]).localtime
            # conflict if start temp/temp+1 time is in between start and end
            if (temp_time >= start_time and temp_time <= end_time) or (temp_time_one_hour >= start_time and temp_time_one_hour <= end_time)
              viable = false
              break
            end
          end
        end
        if viable == true
          goodTimes << {"start": temp_time, "end": temp_time_one_hour}
        end
      end
    end
    goodTimes
  end

  def find_or_create_user(user_type, name, email)
    if user_type == "tenant"
      potential_tenant = Tenant.find_by(email: email)
      if Tenant.find_by(email: email)
        potential_tenant
      else
        Tenant.create(id: Tenant.last ? Tenant.last.id + 1 : 0, name: name, email: email)
      end
    elsif user_type == "landowner"
      potential_landowner = Landowner.find_by(email: email)
      if Landowner.find_by(email: email)
        potential_landowner
      else
        Landowner.create(id: Landowner.last ? Landowner.last.id + 1 : 0, name: name, email: email)
      end
    end
  end
end
