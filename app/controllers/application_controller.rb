class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  # make sure to configure your own local_env.yml file DONT PUT UR OWN KEYS HERE
  def clientOptions
		{
			client_id: ENV["google_client_id"],
      client_secret: ENV["google_client_secret"],
      authorization_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_credential_uri: 'https://accounts.google.com/o/oauth2/token',
      scope: [Google::Apis::CalendarV3::AUTH_CALENDAR, "https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile"],
      redirect_uri: "http://localhost:3000/calendar/callback"
		}
  end
end
