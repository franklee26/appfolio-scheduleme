require 'net/http'  # for GET request

class CalendarController < ApplicationController
  def index
    client = Signet::OAuth2::Client.new(clientOptions)
    client.update!(session[:authorization])

    service = Google::Apis::CalendarV3::CalendarService.new
    service.authorization = client

    # this is kinda stupid, I don't really know another way lmao
    id_token = client.id_token
    # make a GET request to this weird API (finds the email based on the id_token I think)
    uri = URI.parse('https://oauth2.googleapis.com/tokeninfo?id_token=' + id_token)
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true
    http.verify_mode = OpenSSL::SSL::VERIFY_NONE # You should use VERIFY_PEER in production
    request = Net::HTTP::Get.new(uri.request_uri)
    res = http.request(request)

    @email = JSON(res.body)["email"]

    @calendars = service.list_calendar_lists.items
  end

  def auth
    client = Signet::OAuth2::Client.new(clientOptions)
    redirect_to client.authorization_uri.to_s
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

  # configure your own local_env.yml file (DONT HARD CODE UR OWN API TOKENS)
  require 'google/apis/identitytoolkit_v3'
	def clientOptions
		{
			client_id: ENV["google_client_id"],
      client_secret: ENV["google_client_secret"],
      authorization_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_credential_uri: 'https://accounts.google.com/o/oauth2/token',
      scope: [Google::Apis::CalendarV3::AUTH_CALENDAR, "https://www.googleapis.com/auth/userinfo.email"],
      redirect_uri: "http://localhost:3000/calendar/callback"
		}
	end
end
