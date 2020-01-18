class TenantsController < ApplicationController
  def index
    render json: Tenant.all, status: :ok
  end

  def new
  end

  def login
  end

  def show
    @tenant = Tenant.find(params[:id])
  end

  def auth
    client = Signet::OAuth2::Client.new(clientOptions)
    session[:user_type] = "tenant"
    redirect_to client.authorization_uri.to_s
  end
end
