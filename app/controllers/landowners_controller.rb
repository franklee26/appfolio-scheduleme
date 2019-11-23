class LandownersController < ApplicationController
  def index

    # @jobs = Job.where('"Tenant_id" = ?', 1)


  	#@jobs = Job.all
  end

  def auth
    client = Signet::OAuth2::Client.new(clientOptions)
    session[:user_type] = "landowner"
    redirect_to client.authorization_uri.to_s
  end
end
