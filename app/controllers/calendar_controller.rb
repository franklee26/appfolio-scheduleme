class CalendarController < ApplicationController
  def index
    client = Signet::OAuth2::Client.new(clientOptions)
    client.update!(session[:authorization])

    service = Google::Apis::CalendarV3::CalendarService.new
    service.authorization = client

    @calendars = service.list_calendar_lists.items
  end

  def auth
    client = Signet::OAuth2::Client.new(clientOptions)
    redirect_to client.authorization_uri.to_s
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
	def clientOptions
		{
			client_id: ENV["google_client_id"],
      client_secret: ENV["google_client_secret"],
      authorization_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_credential_uri: 'https://accounts.google.com/o/oauth2/token',
      scope: Google::Apis::CalendarV3::AUTH_CALENDAR,
      redirect_uri: "http://localhost:3000/calendar/callback"
		}
	end
end
