require 'net/http'  # for GET request
require 'json'
require 'rest-client'

class CalendarController < ApplicationController
  skip_before_action :verify_authenticity_token
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

    busy_times = get_list_of_times(freebusy_times)
    free_times = get_free_times(busy_times)
    # find or build the user
    @user = find_or_create_user(session[:user_type], json_response["name"], json_response["email"], free_times)
    session[:user_id] = @user.id
  end

  def user_selection
  end

  # returns this response: https://developers.google.com/calendar/v3/reference/calendars#resource
  def get
    uri = URI.parse(
      "https://www.googleapis.com/calendar/v3/calendars/" + 
      params[:calendar_id]+"/events?alt=json&access_token=" + 
      session[:authorization]["access_token"]
    )
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true
    response = Net::HTTP.get(uri)
    render json: response, status: :ok
  end

  def post
    uri = URI.parse(
      "https://www.googleapis.com/calendar/v3/calendars/" + 
      params[:calendar_id]+"/events?alt=json&access_token=" + 
      session[:authorization]["access_token"]
    )
    header = {'Content-Type': 'application/json'}
    request_body = {
      "start": {
        "dateTime": params[:start],
        "timeZone": "America/Los_Angeles"
      },
      "end": {
        "dateTime": params[:end],
        "timeZone": "America/Los_Angeles"
      },
      "summary": "uber_for_vendors_appt",
      "colorId": "7"
    }
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true
    request = Net::HTTP::Post.new(uri.request_uri, header)
    request.body = request_body.to_json
    response = http.request(request).body
    render json: response, status: :ok
  end

  def events
    client = Signet::OAuth2::Client.new(clientOptions)
    client.update!(session[:authorization])

    service = Google::Apis::CalendarV3::CalendarService.new
    service.authorization = client
    @calendar_id = params[:calendar_id]
    events_temp = []
    if params[:calendar_id] != "en.usa" && params[:calendar_id] != "addressbook"
      events_temp = service.list_events(params[:calendar_id]).items
    end
    @events = []
    @id = session[:user_id]
    # I should do some filtering
    events_temp.each do |event|
      if not event.end.date_time < (Time.now.localtime.beginning_of_day - 7.days)
        @events << event
      end
    end

    # this is kinda stupid, I don't really know another way lmao
    calendars = service.list_calendar_lists.items
    calendar_ids = get_list_of_cal_ids(calendars)

    access_token = client.access_token
    json_response = get_json_from_token(access_token)
    freebusy_times = get_freebusy_response(access_token, calendar_ids)["calendars"]

    busy_times = get_list_of_times(freebusy_times)
    # find or build the user
    @free_times = get_free_times(busy_times)
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
            if (temp_time >= start_time and temp_time < end_time) or (temp_time_one_hour > start_time and temp_time_one_hour <= end_time)
              viable = false
              break
            end
          end
        end
        if viable == true
          goodTimes << {"start": temp_time, "end": temp_time_one_hour}
        end
        if goodTimes.length >= 40
          return goodTimes
        end
      end
    end
    goodTimes
  end

  def find_or_create_user(user_type, name, email, times)
    if user_type == "tenant"
      potential_tenant = Tenant.find_by(email: email)
      if potential_tenant
        # for every login, reset freebusy times
        potential_tenant.freebusies.delete_all
        # now repopulate with these new times
        times.each do |time|
          temp = Freebusy.new(start: time[:start], end: time[:end], tenant: potential_tenant, landowner_id: 0, vendor_id: 0)
          potential_tenant.freebusies << temp
        end
        potential_tenant.save!
        session[:tenant_id] = potential_tenant.id
        potential_tenant
      else
        tenant = Tenant.new(
          name: name, 
          email: email, 
          created_at: Time.now, 
          updated_at: Time.now, 
          landowner_id: 0,
          freebusies: []
          )
        tenant.save!
        freebusies = []
        times.each do |time|
          temp = Freebusy.new(start: time[:start], end: time[:end], tenant_id: tenant.id, landowner_id: 0, vendor_id: 0)
          freebusies << temp
        end
        tenant.freebusies = freebusies
        tenant.save!
        session[:tenant_id] = tenant.id
        tenant
      end
    elsif user_type == "landowner"
      potential_landowner = Landowner.find_by(email: email)
      if potential_landowner
        potential_landowner.freebusies.delete_all
        times.each do |time|
          temp = Freebusy.new(start: time[:start], end: time[:end], tenant_id: 0, landowner: potential_landowner, vendor_id: 0)
          potential_landowner.freebusies << temp
        end
        potential_landowner.save!
        potential_landowner
      else
        landowner = Landowner.new(
          name: name, 
          email: email,
          freebusies: [],
          created_at: Time.now, 
          updated_at: Time.now,
          vendor_ids: []
          )
        landowner.save!
        freebusies = []
        times.each do |time|
          temp = Freebusy.new(start: time[:start], end: time[:end], tenant_id: 0, landowner_id: landowner.id, vendor_id: 0)
          freebusies << temp
        end
        landowner.freebusies = freebusies
        landowner.save!
        landowner
      end
    elsif user_type == "vendor"
      potential_vendor = Vendor.find_by(email: email)
      if potential_vendor
        potential_vendor.freebusies.delete_all
        times.each do |time|
          temp = Freebusy.new(start: time[:start], end: time[:end], tenant_id: 0, landowner_id: 0, vendor: potential_vendor)
          potential_vendor.freebusies << temp
        end
        potential_vendor.save!
        potential_vendor
      else
        vendor = Vendor.new(
          name: name, 
          email: email,
          freebusies: [],
          created_at: Time.now, 
          updated_at: Time.now,
          landowner_ids: []
          )
        vendor.save!
        freebusies = []
        times.each do |time|
          temp = Freebusy.new(start: time[:start], end: time[:end], tenant_id: 0, landowner_id: 0, vendor_id: vendor.id)
          freebusies << temp
        end
        vendor.freebusies = freebusies
        vendor.save!
        vendor
      end
    end
  end
end
