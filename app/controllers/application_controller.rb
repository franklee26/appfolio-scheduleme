require 'date'

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
      redirect_uri: "http://localhost:3000/calendar/callback", 
      prompt: "consent"
		}
  end


  # Refresh the token and returns the new access token. 
  # TODO: add checks for landowner and Vendor as well
  def refreshToken(user_email, user_type)

    # get stored access_token and refresh_token
    user = nil
    if user_type == "tenant"
      user = Tenant.find_by(email: user_email)
    end
    auth_token = JSON.parse(user.auth_token) #and access specific field
    refresh_token = user.refresh_token

    # put refresh token into client so I can run the refresh function on it
    client = Signet::OAuth2::Client.new(clientOptions)
    client.update!(auth_token)
    client.update!({refresh_token: refresh_token})
    client.refresh!

    # construct auth_token json to put into database
    access_token = client.access_token
    refresh_token = client.refresh_token
    expires_at = DateTime.now + Rational(3500, 86400)
    new_auth_token = {
      access_token: access_token, 
      expires_at: expires_at
    }

    # save token information into database for user
    user.auth_token = new_auth_token
    if refresh_token != nil
      user.refresh_token = refresh_token
    end
    user.save!

    # return access token
    new_auth_token
  end


  # Checks if access token has expired. If it has expired, it will refresh it. Returns a json with the access token and the expiration time. 
  def retrieveAccessToken(user_email, user_type)

    # Get user auth information. Contains access token and refresh token. 
    user = nil
    if user_type == "tenant"
      user = Tenant.find_by(email: user_email)
    end
    auth_token = JSON.parse(user.auth_token) #and access specific field
    refresh_token = user.refresh_token

    # Check if access token has expired. If no, return access token. If yes, refresh then return new one. 
    current_time = DateTime.now
    expired_time = DateTime.parse(auth_token["expires_at"])

    if current_time - expired_time < 0
      auth_token
    else
      refreshToken(user_email, user_type)
    end
  end

end
