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
      prompt: 'consent'
		}
  end


  # Refresh the token and returns the new access token. 
  # TODO: Maybe return error if fail. Right now it assumes your user_id is legit. 
  def refreshToken(user_id, user_type)

    # Get user using user_id and user_type
    user = nil
    if user_type == "tenant"
      user = Tenant.find_by(id: user_id)
    elsif user_type == "vendor"
      user = Vendor.find_by(id: user_id)
    elsif user_type == "landowner"
      user = Landowner.find_by(id: user_id)
    end

    # get stored access_token and refresh_token
    auth_token = JSON.parse(user.auth_token) #and access specific field
    refresh_token = user.refresh_token

    # put refresh token into client so I can run the refresh function on it
    client = Signet::OAuth2::Client.new(clientOptions)
    client.update!(auth_token)
    client.update!({refresh_token: refresh_token})
    client.refresh!

    # construct auth_token json to store into database
    access_token = client.access_token
    refresh_token = client.refresh_token
    expires_at = DateTime.now + Rational(3500, 86400)
    new_auth_token = {
      access_token: access_token, 
      expires_at: expires_at
    }

    user_email = user.email;

    # save token information into database for each user type
    # For Tenant
    tenant = Tenant.find_by(email: user_email)
    if tenant != nil
      tenant.auth_token = new_auth_token.to_json
      if refresh_token != nil
        tenant.refresh_token = refresh_token
      end
      tenant.save!
    end

    # For Landowner
    landowner = Landowner.find_by(email: user_email)
    if landowner != nil
      landowner.auth_token = new_auth_token.to_json
      if refresh_token != nil
        landowner.refresh_token = refresh_token
      end
      landowner.save!
    end

    # For Vendors
    vendor = Vendor.find_by(email: user_email)
    if vendor != nil
      vendor.auth_token = new_auth_token.to_json
      if refresh_token != nil
        vendor.refresh_token = refresh_token
      end
      vendor.save!
    end

    # return access token
    new_auth_token[:access_token]
  end


  # Checks if access token has expired. If it has expired, it will refresh it. Returns a json with the access token and the expiration time. 
  # TODO: Maybe return error if fail. Right now it assumes your user_id is legit. 
  def retrieveAccessToken(user_id, user_type)

    # Get user using user_id and user_type
    user = nil
    if user_type == "tenant"
      user = Tenant.find_by(id: user_id)
    elsif user_type == "vendor"
      user = Vendor.find_by(id: user_id)
    elsif user_type == "landowner"
      user = Landowner.find_by(id: user_id)
    end

    # Get user auth information. Contains access token and refresh token. 
    auth_token = JSON.parse(user.auth_token) #and access specific field
    refresh_token = user.refresh_token

    # Check if access token has expired. If no, return access token. If yes, refresh then return new one. 
    current_time = DateTime.now
    expired_time = DateTime.parse(auth_token["expires_at"])

    if current_time - expired_time < 0
      auth_token["access_token"]
    else
      refreshToken(user_id, user_type)
    end
  end

end
