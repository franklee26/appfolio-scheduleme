require 'net/http'  # for GET request
require 'json'
require 'rest-client'
require 'set'

class CalendarController < ApplicationController
  skip_before_action :verify_authenticity_token
  def index

    access_token = retrieveAccessToken(session[:user_id], session[:user_type])
    @calendars = get_user_calendars(access_token)
    calendar_ids = get_list_of_cal_ids(@calendars) #prob not needed anymore

    @user = find_user(session[:user_id], session[:user_type])
    @GOOGLE_MAPS_KEY = ENV["google_maps_key"]
  end

  def user_selection
  end

  def calendar_submission
    access_token = retrieveAccessToken(session[:user_id], session[:user_type])
    @user = find_user(session[:user_id], session[:user_type])
    all_calendars = get_user_calendars(access_token)
    @calendars = all_calendars.filter { |c| c.summary != "Holidays in United States" && c.summary != @user.email && c.summary != "Contacts" }
  end

  def vendor_selection
    access_token = retrieveAccessToken(session[:user_id], session[:user_type])
    @user = find_user(session[:user_id], session[:user_type])
    all_calendars = get_user_calendars(access_token)
    @calendars = all_calendars.filter { |c| c.summary != "Holidays in United States" && c.summary != @user.email && c.summary != "Contacts" }
    @calendar_id = params[:calendar_id]
    @vendors = Vendor.find_by_sql("select * from vendors where id in (select distinct vendor_id from jobs where status='LANDOWNER APPROVED' and tenant_id=#{@user.id})")
  end

  # returns this response: https://developers.google.com/calendar/v3/reference/calendars#resource
  def get

    # Get user's access token
    user_type = session[:user_type]
    user_id = session[:user_id]
    access_token = retrieveAccessToken(user_id, user_type)

    uri = URI.parse(
      "https://www.googleapis.com/calendar/v3/calendars/" + 
      params[:calendar_id]+"/events?alt=json&access_token=" + 
      access_token
    )
    
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true
    response = Net::HTTP.get(uri)
    render json: response, status: :ok
  end

  def post
    # Get user's access token
    body = JSON(request.body.read)
    job_id = body["job_id"]
    job = Job.find(job_id)
    tenant_id = job.tenant_id
    vendor_id = job.vendor_id
    vendor_calendar_id = Vendor.find(vendor_id).calendar_id
    if vendor_calendar_id == nil
      render json: {status: 404}
      return
    end

    access_token = retrieveAccessToken(tenant_id, "tenant")
    # post to selected calendar
    uri = URI.parse(
      "https://www.googleapis.com/calendar/v3/calendars/" + 
      params[:calendar_id]+"/events?alt=json&access_token=" + 
      access_token
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
      "summary": "scheduleMe_appt_TENANT",
      "description": job.title,
      "colorId": "7"
    }
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true
    request = Net::HTTP::Post.new(uri.request_uri, header)
    request.body = request_body.to_json
    response = http.request(request).body

    access_token = retrieveAccessToken(vendor_id, "vendor")

    uri = URI.parse(
      "https://www.googleapis.com/calendar/v3/calendars/" + 
      vendor_calendar_id+"/events?alt=json&access_token=" + 
      access_token
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
      "summary": "scheduleMe_appt_VENDOR",
      "description": job.title,
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
    access_token = retrieveAccessToken(session[:user_id], session[:user_type])

    client = Signet::OAuth2::Client.new(clientOptions)
    client.update!(access_token: access_token)

    service = Google::Apis::CalendarV3::CalendarService.new
    service.authorization = client
    @calendar_id = params[:calendar_id]
    @vendor_id = params[:vendor_id]
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

  def schedule
    landowner_id = params[:landowner_id]
    tenant_id = params[:tenant_id]
    # returns a list of viable vendors
    viable_vendors = new_schedule(landowner_id, tenant_id)

    body = {
      vendors: viable_vendors
    }

    render json: body
  end
  
  def callback
    client = Signet::OAuth2::Client.new(clientOptions)
    client.code = params[:code]
    response = client.fetch_access_token!
    session[:authorization] = response

    access_token = client.access_token
    refresh_token = client.refresh_token
    json_response = get_json_from_token(access_token) # look into whether this needs to be here

    auth_token_info = {
      access_token: access_token,
      expires_at: DateTime.now + Rational(3500, 86400) # made it 2 minutes sooner just in case
    }

    # Find and create user if not exist. Then store into our session
    @user = find_or_create_user(session[:user_type], json_response["name"], json_response["email"], auth_token_info.to_json, client.refresh_token)
    session[:user_id] = @user.id

    # For each user type of the same email, if it exists in our database already, update its refresh/access token
    # For Tenant
    tenant = Tenant.find_by(email: @user.email)
    if tenant != nil
      tenant.auth_token = auth_token_info.to_json
      if refresh_token != nil
        tenant.refresh_token = refresh_token
      end
      tenant.save!
    end

    # For Landowner
    landowner = Landowner.find_by(email: @user.email)
    if landowner != nil
      landowner.auth_token = auth_token_info.to_json
      if refresh_token != nil
        landowner.refresh_token = refresh_token
      end
      landowner.save!
    end

    # For Vendors
    vendor = Vendor.find_by(email: @user.email)
    if vendor != nil
      vendor.auth_token = auth_token_info.to_json
      if refresh_token != nil
        vendor.refresh_token = refresh_token
      end
      vendor.save!
    end
    
    redirect_to '/calendar'
  end

  def add_default
    body = JSON(request.body.read)
    vendor_id = body["vendor_id"]
    calendar_id = body["calendar_id"]
    vendor = Vendor.find(vendor_id)
    vendor.calendar_id = calendar_id
    vendor.save!
    render json: {status: 200}
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

  def get_user_calendars(access_token)
    client = Signet::OAuth2::Client.new(clientOptions)
    client.update!(access_token: access_token)

    service = Google::Apis::CalendarV3::CalendarService.new
    service.authorization = client
    user_calendars = service.list_calendar_lists.items
    user_calendars
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

  def find_user(user_id, user_type) 
    user = nil
    if user_type == "tenant"
      user = Tenant.find_by(id: user_id)
    elsif user_type == "vendor"
      user = Vendor.find_by(id: user_id)
    elsif user_type == "landowner"
      user = Landowner.find_by(id: user_id)
    end
    user
  end

  def find_or_create_user(user_type, name, email, auth_token, refresh_token)

    if user_type == "tenant"
      potential_tenant = Tenant.find_by(email: email)
      if potential_tenant

        # update auth token for this tenant
        potential_tenant.auth_token = auth_token
        if refresh_token != nil
          potential_tenant.refresh_token = refresh_token
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
          auth_token: auth_token, 
          refresh_token: refresh_token
          )
        tenant.save!

        session[:tenant_id] = tenant.id
        tenant
      end
    elsif user_type == "landowner"
      potential_landowner = Landowner.find_by(email: email)
      if potential_landowner

        # update auth token for this landowner
        potential_landowner.auth_token = auth_token
        if refresh_token != nil
          potential_landowner.refresh_token = refresh_token
        end
        potential_landowner.save!
        potential_landowner
      else
        landowner = Landowner.new(
          name: name, 
          email: email,
          created_at: Time.now, 
          updated_at: Time.now,
          vendor_ids: [],
          auth_token: auth_token, 
          refresh_token: refresh_token
          )
        landowner.save!
        landowner
      end
    elsif user_type == "vendor"
      potential_vendor = Vendor.find_by(email: email)
      if potential_vendor

        # update auth token for this vendor
        potential_vendor.auth_token = auth_token
        if refresh_token != nil
          potential_vendor.refresh_token = refresh_token
        end
        potential_vendor.save!

        potential_vendor
      else
        vendor = Vendor.new(
          name: name, 
          email: email,
          created_at: Time.now, 
          updated_at: Time.now,
          landowner_ids: [], 
          auth_token: auth_token, 
          refresh_token: refresh_token
          )
        vendor.save!

        vendor
      end
    end
  end

  private

  def get_viable_vendors(landowner_id, tenant_id)
    ans = []
    landowner = Landowner.find_by(id: landowner_id)
    tenant = Tenant.find_by(id: tenant_id)
    vendors = landowner.vendors

    # retrieve access token for tenant's account
    access_token = retrieveAccessToken(tenant.id, "tenant")

    tenant_calendars = get_user_calendars(access_token)
    tenant_calendar_ids = get_list_of_cal_ids(tenant_calendars)

    # get tenant free times
    t_freebusy_times = get_freebusy_response(access_token, tenant_calendar_ids)["calendars"] 
    t_busy_times = get_list_of_times(t_freebusy_times)
    tenant_free_times = get_free_times(t_busy_times)

    tenant_start = tenant_free_times.map { |t| t[:start] }

    vendors.each do |v|
      if v.calendar_id != nil
        # retrieve access token for vendor's account
        access_token = retrieveAccessToken(v.id, "vendor")

        vendor_calendars = get_user_calendars(access_token)
        vendor_calendar_ids = get_list_of_cal_ids(vendor_calendars)

        # get vendor free times
        v_freebusy_times = get_freebusy_response(access_token, vendor_calendar_ids)["calendars"] 
        v_busy_times = get_list_of_times(v_freebusy_times)
        vendor_free_times = get_free_times(v_busy_times)

        # add free busy times to array "ans" until it reaches 10. 
        vendor_free_times.each do |f|
          if ans.length >= 10
            return ans
          end
          if tenant_start.include? f[:start]
            ans << {"vendor": v, "start": f[:start], "end": f[:end]}
          end
        end
      end
    end

    ans
  end


  ### For a deeper scheduling ###
  def get_shared_free_times(t_busy_times, v_busy_times)
    tenant_times = (t_busy_times.map{|t| {"start"=> Time.parse(t["start"]).localtime, "end"=> Time.parse(t["end"]).localtime} if t["start"]}).compact
    vendor_times = (v_busy_times.map{|t| {"start"=> Time.parse(t["start"]).localtime, "end"=> Time.parse(t["end"]).localtime} if t["start"]}).compact
    t_index = 0
    v_index = 0


    # Combine Tenant's and Vendor's busy times together. Only retains relavent ones between day start and day end for first 14 days. 
    combined_busy = []
    (0..14).each do |day|
      day_start = (Time.now.localtime.beginning_of_day + day.days) + (9).hours
      day_end = (Time.now.localtime.beginning_of_day + day.days) + (17).hours
      t_day_times = tenant_times.map{|t| t if t["start"] > day_start && t["start"] < day_end || t["end"] > day_start && t["end"] < day_end}
      v_day_times = vendor_times.map{|t| t if t["start"] > day_start && t["start"] < day_end || t["end"] > day_start && t["end"] < day_end}
      
      combined_times = (t_day_times + v_day_times).compact
      if combined_times.length > 0
        combined_times = combined_times.sort_by { |t| t["start"] }
        if combined_times[0]["start"] < day_start
          combined_times[0]["start"] = day_start
        end

        if combined_times[combined_times.length-1]["end"] > day_end
          combined_times[combined_times.length-1]["end"] = day_end
        end

        combined_times.each_with_index do |cur_busy, index| 
          if index == combined_times.length - 1
            combined_busy << cur_busy
          else
            if cur_busy["end"] < combined_times[index+1]["start"] 
              combined_busy << cur_busy
            else
              combined_times[index+1]["start"] = cur_busy["start"]
              if cur_busy["end"] > combined_times[index+1]["end"]
                combined_times[index+1]["end"] = cur_busy["end"]
              end
            end
          end
        end
      end

    end

    free_times = []
    (0..14).each do |day|
      day_start = (Time.now.localtime.beginning_of_day + day.days) + (9).hours
      day_end = (Time.now.localtime.beginning_of_day + day.days) + (17).hours

      busy_today = combined_busy.map{|t| t if t["start"] >= day_start && t["end"] <= day_end}.compact

      cur_start = day_start

      if busy_today.length == 0
        free_times << {"start": day_start, "end": day_end}
      end

      busy_today.each_with_index do |b_time, index|
        if index == 0
          if b_time["start"] > day_start
            free_times << {"start": day_start, "end": b_time["start"]}
          end
          if busy_today.length == 1
            if day_end > b_time["end"] 
              free_times << {"start": b_time["end"], "end": day_end}
            end
          end
        elsif index == busy_today.length - 1
          free_times << {"start": busy_today[index-1]["end"], "end": b_time["start"]}
          if day_end > b_time["end"] 
            free_times << {"start": b_time["end"], "end": day_end}
          end
        else
          free_times << {"start": busy_today[index-1]["end"], "end": b_time["start"]}
        end
      end
    end

    free_times
  end

  def add_vendor_location_to_free_times(free_times)
    default_address = "879 Embarcadero del Norte, Goleta, CA 93117"

    free_time_with_more_info = []
    free_times.each do |f_time|
      default_start = f_time[:start].beginning_of_day + (9).hours
      default_end = f_time[:start].beginning_of_day + (17).hours

      prev_job_loc = default_address
      prev_job_end = default_start
      post_job_loc = default_address
      post_job_start = default_end

      prev_job = Job.find_by_sql("select * from jobs where start < '#{f_time[:start]+(8).hours}' and start > '#{default_start+(8).hours}' order by start desc limit 1;")
      if prev_job.length == 1
        prev_job = prev_job[0]
        prev_tenant = Tenant.find(prev_job.tenant_id)        
        job_loc = address_builder(prev_tenant.street_address, prev_tenant.city, prev_tenant.state, prev_tenant.zip)

        if prev_job.end > default_start
          prev_job_end = prev_job.end

          if job_loc != ""
            prev_job_loc = job_loc
          end
        end
      end

      post_job = Job.find_by_sql("select * from jobs where start > '#{f_time[:start]+(8).hours}' and start < '#{default_end+(8).hours}' order by start asc limit 1;")
      if post_job.length == 1
        post_job = post_job[0]
        post_tenant = Tenant.find(post_job.tenant_id)
        job_loc = address_builder(post_tenant.street_address, post_tenant.city, post_tenant.state, post_tenant.zip)
        if post_job.start < default_end
          post_job_start = post_job.start
          if job_loc != ""
            post_job_loc = job_loc
          end
        end
      end

      free_time_with_more_info << {
        "start": f_time[:start], 
        "end": f_time[:end], 
        "prev_job_loc": prev_job_loc, 
        "prev_job_end_time": prev_job_end, 
        "post_job_loc": post_job_loc, 
        "post_job_start_time": post_job_start
      }
    end
    free_time_with_more_info
  end

  def address_builder(street, city, state, zip)
    fields = [street, city, state, zip]
    address = ""
    fields.each do |field|
      if field != nil
        address += field + ", "
      end
    end

    if address != ""
      address.delete_suffix(', ') 
    end

    return address
  end

  # Pass in drive time. Numbers here are arbitrary and subject to change
  def rate_dist(drive_time_in_sec)
    d_rating = 50.0
    dt_min = drive_time_in_sec / 60.0

    if dt_min <= 30
      d_rating += ((30.0 - dt_min) / 30.0) * 50.0 
    elsif dt_min <= 40
      d_rating -= ((dt_min-30.0) / 10.0) * 20.0
    elsif dt_min < 150
      d_rating -= (20 + ((dt_min / 150.0) * 30.0))
    else 
      d_rating += 0
    end
    d_rating
  end

  # passed in slot time should be total time - drive time (and maybe also break time)
  # numbers here are arbitrary and subject to change
  # Values are passed in as seconds. we'll evaluate them as minutes i guess. 
  def rate_slot(slot_time, drive_time)
    # these average times can be based off of a larger set of times in the future
    avg_drive_time = 10.0
    avg_work_time = 40.0

    if slot_time < drive_time
      value = 0
    else
      if slot_time < (avg_drive_time * 2 + avg_work_time) * 60.0
        full_score = 100.0
        total_time = (avg_drive_time * 2 + avg_work_time) * 60 - drive_time
        open_time = (slot_time - drive_time)
        value = 50.0 + ((total_time - open_time) / (total_time) ) * 50.0
      else
        value = 80.0
      end
    end
    value
  end

  # formula is barely representative of an actual idea and subject to change
  def rate_scheduled_time(event_start, pre_dist, post_dist, pre_slot, post_slot, sched_type)
    # get a rating on the driving time before and after slot
    d1_rating = rate_dist(pre_dist) / 100.0
    d2_rating = rate_dist(post_dist) / 100.0

    # get a rating on how tight of a schedule before and after is
    pre_slot_rating = rate_slot(pre_slot, pre_dist) / 100.0
    post_slot_rating = rate_slot(post_slot, post_dist) / 100.0

    # combine both. Ideal is short drive time and tight spot. Not ideal is long drive time and big gap. 
    pre_rating = d1_rating * pre_slot_rating
    post_rating = d2_rating * post_slot_rating

    # Get the final rating. Will add a bonus up to ~20% if the event is scheduled closer to today
    today_date = Time.now.localtime.beginning_of_day
    days_ahead = (event_start - today_date) / 60.0 / 60.0 / 24.0
    final_rating = pre_rating * post_rating
    #final_rating += (1.0 - final_rating) * ((15.0 - days_ahead) / 15.0) * 0.4

    ratings = {
      "pre_dist_rating": d1_rating, 
      "post_dist_rating": d2_rating, 
      "pre_slot_rating": pre_slot_rating, 
      "post_slot_rating": post_slot_rating, 
      "pre_rating": pre_rating, 
      "post_rating": post_rating, 
      # "avg_slot_rating": avg_slot_rating, 
      "final_rating": final_rating, 
      "pre_drive": pre_dist, 
      "post_drive": post_dist, 
      "pre_slot": pre_slot, 
      "post_slot": post_slot, 
      "sched_type": sched_type

    }
  end

  # schedule time based on the times given
  def schedule_at_beginning_of_block(free_block, pre_drive_time, post_drive_time, event_time)
    total_task_time =pre_drive_time + post_drive_time + event_time
    block_time = free_block[:end] - free_block[:start]
    if total_task_time < block_time
      [{
        "start": free_block[:start]+(pre_drive_time).seconds, 
        "end": free_block[:start]+(pre_drive_time+event_time).seconds,
        "prev_job_end_time": free_block[:prev_job_end_time], 
        "post_job_start_time": free_block[:post_job_start_time], 
        "prev_job_loc": free_block[:prev_job_loc], 
        "post_job_loc": free_block[:post_job_loc], 
        "sched_type": "beg"
      }]
    else
      []
    end
  end

  def schedule_at_end_of_block(free_block, pre_drive_time, post_drive_time, event_time)
    total_task_time =pre_drive_time + post_drive_time + event_time
    block_time = free_block[:end] - free_block[:start]
    if total_task_time < block_time
      [{
        "start": free_block[:end]-(post_drive_time+event_time).seconds, 
        "end": free_block[:end]-(post_drive_time).seconds, 
        "prev_job_end_time": free_block[:prev_job_end_time], 
        "post_job_start_time": free_block[:post_job_start_time], 
        "prev_job_loc": free_block[:prev_job_loc], 
        "post_job_loc": free_block[:post_job_loc], 
        "sched_type": "end"
      }]
    else
      []
    end
  end

  # I'm spacing out the times by the average work time.
  def schedule_at_middle_of_block(free_block, pre_drive_time, post_drive_time, event_time)
    avg_drive_time = 10
    avg_work_time = 40

    work_block = ((avg_drive_time * 2 + avg_work_time) * 60).seconds
    new_start = free_block[:start] + work_block

    time_blocks = []
    while new_start < free_block[:end]
      new_end = new_start + (pre_drive_time + post_drive_time + event_time).seconds
      if new_end < free_block[:end]
        time_blocks << {
          "start": new_start + (pre_drive_time).seconds, 
          "end": new_start + (pre_drive_time + event_time).seconds, 
          "prev_job_end_time": free_block[:start], 
          "post_job_start_time": free_block[:end], 
          "prev_job_loc": free_block[:prev_job_loc], 
          "post_job_loc": free_block[:post_job_loc], 
          "sched_type": "mid"
        }
      else
        break
      end

      new_start += work_block
    end

    time_blocks
  end

  def format_location_list(location_list)
    result = ""
    location_list.each do |loc, index|
      if index != 0 
        result += "|"
      end
      result += loc.sub(" ", "+")
    end
    result
  end

  # verify the new time isn't conflicting with the others preceding it
  def does_time_conflict(job_times, new_time)
    value = false
    n_start = new_time[:start]
    n_end = new_time[:end]

    job_times.each do |job|
      j_start = job[:start]
      j_end = job[:end]
      if (n_start >= j_start and n_start <= j_end) or (n_end >= j_start and n_end <= j_end) or (n_start <= j_start and n_end >= j_end)
        value = true
      end
    end
    value
  end

  def get_times_in_day(potential_job_times, day_start, day_end)
    times_in_day = []
    potential_job_times.each do |t_slot|
      if t_slot[:start] >= day_start and t_slot[:end] <= day_end
        times_in_day << t_slot
      end
    end
    times_in_day
  end

  def pick_top_n_times(potential_job_times, n)

    top_n_times = []

    (0..14).each do |day|  
      day_start = (Time.now.localtime.beginning_of_day + day.days) + (9).hours
      day_end = (Time.now.localtime.beginning_of_day + day.days) + (17).hours

      times_in_day = get_times_in_day(potential_job_times, day_start, day_end)
      times_in_day = times_in_day.sort_by { |t| t[:rating][:final_rating] }.reverse

      max_a_day = 3
      times_in_day.each do |t_slot|

        if not does_time_conflict(top_n_times, t_slot)
          top_n_times << t_slot
          max_a_day -= 1
        end
      
        if max_a_day == 0 or top_n_times.length == n
          break
        end
      end

      if top_n_times.length == n
        break
      end
    end

    top_n_times
  end

  def add_vendor_to_times(job_times, vendor_id)
    vendor_info = Vendor.find(vendor_id)
    job_times.each do |job|
      job[:vendor] = vendor_info
    end
  end

  def new_schedule(landowner_id, tenant_id)
    landowner = Landowner.find_by(id: landowner_id)
    tenant = Tenant.find_by(id: tenant_id)
    vendors = landowner.vendors

    best_times = []
    vendors.each do |v|
      vendor_times = sorted_vendor_times(tenant_id, v.id)
      vendor_times_sorted = vendor_times.sort_by { |t| t[:rating][:final_rating] }.reverse # JUST IN CASE, too lazy to test without
      best_times += pick_top_n_times(vendor_times_sorted, 10)
    end

    best_times = best_times.sort_by {|t| t[:start]}
    best_times 
  end

  def sorted_vendor_times(tenant_id, vendor_id)
    job_time = 40 * 60

    # get tenant's busy times
    t_access_token = retrieveAccessToken(tenant_id, "tenant")
    tenant_calendars = get_user_calendars(t_access_token)
    tenant_calendar_ids = get_list_of_cal_ids(tenant_calendars)
    t_freebusy_times = get_list_of_times(get_freebusy_response(t_access_token, tenant_calendar_ids)["calendars"])

    # Get vendor's busy times
    v_access_token = retrieveAccessToken(vendor_id, "vendor")
    vendor_calendars = get_user_calendars(v_access_token)
    vendor_calendar_ids = get_list_of_cal_ids(vendor_calendars)
    v_freebusy_times = get_list_of_times(get_freebusy_response(v_access_token, vendor_calendar_ids)["calendars"])

    # Get list of free times betweent he vendor and the tenant
    free_times = get_shared_free_times(t_freebusy_times, v_freebusy_times)

    # Add vendor's location onto the list of free times
    free_times = add_vendor_location_to_free_times(free_times)

    # generate origin and destination location list
    tenant = Tenant.find(tenant_id)
    origin = [address_builder(tenant.street_address, tenant.city, tenant.state, tenant.zip)]
    destinations = Set.new
    free_times.each do |ft|
      destinations << ft[:prev_job_loc]
      destinations << ft[:post_job_loc]
    end

    #set up destination hash to retrieve value easier
    dest_hash = {}
    matrix_index = 0
    destinations.each do |d|
      if not dest_hash.key?(d)
        dest_hash[d] = matrix_index
        matrix_index += 1
      end
    end

    # split up array into groups of 24 because that is max number google api can take
    dest_subgroup = []
    group_index = 0
    temp_group = []
    destinations.each do |d|
      if group_index == 24
        dest_subgroup << temp_group
        temp_group = []
        group_index = 0
      else
        group_index += 1
      end
      temp_group << d
    end
    dest_subgroup << temp_group

    # Use google maps matrix to get all distances.
    dist_matrix = []
    dest_subgroup.each do |d_sub|
      uri = URI.parse(
        "https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial" +
        "&origins=" + format_location_list(origin) + 
        "&destinations=" + format_location_list(d_sub) + 
        "&key=" + ENV["google_maps_key"]
      )
      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = true
      response = Net::HTTP.get(uri)

      # Distance matrix. 
      subgroup_matrix = JSON.parse response
      dist_matrix += subgroup_matrix["rows"][0]["elements"]
    end


    # Get a list of job times, including their ratings. 
    potential_job_times = []
    free_times.each do |ft|
      pre_drive_time = dist_matrix[dest_hash[ft[:prev_job_loc]]]["duration"]["value"]
      post_drive_time = dist_matrix[dest_hash[ft[:prev_job_loc]]]["duration"]["value"]

      potential_job_times += schedule_at_beginning_of_block(ft, pre_drive_time, post_drive_time, job_time)
      potential_job_times += schedule_at_end_of_block(ft, pre_drive_time, post_drive_time, job_time)
      potential_job_times += schedule_at_middle_of_block(ft, pre_drive_time, post_drive_time, job_time)
    end

    # Get rating for each potential job times
    potential_job_times.each do |jt|
      pre_drive_time = dist_matrix[dest_hash[jt[:prev_job_loc]]]["duration"]["value"]
      post_drive_time = dist_matrix[dest_hash[jt[:post_job_loc]]]["duration"]["value"]

      # p1 and p2 are in seconds because api call. p3 and p4 are also seconds
      rating = rate_scheduled_time(jt[:start], pre_drive_time, post_drive_time, (jt[:start] - jt[:prev_job_end_time]), (jt[:post_job_start_time] - jt[:end]), jt[:sched_type])
      jt[:rating] = rating
    end

    # sort jobs by their ratings. 
    sorted_job_times = potential_job_times.sort_by { |t| t[:rating][:final_rating] }.reverse

    add_vendor_to_times(sorted_job_times, vendor_id)

    sorted_job_times

  end
end