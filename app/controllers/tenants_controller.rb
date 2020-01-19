class TenantsController < ApplicationController

  # Returns json of all the fields or every tenant
  def index
    render json: Tenant.all, status: :ok
  end

  def no_landowner
    render json: Tenant.where(landowner_id: 0), status: :ok
  end

  # GET /tenants/1
  # Returns a json containing all the fields for the tenant
  def show
    @tenant = Tenant.find(params[:id])
    render json: @tenant
  end

  # GET /tenants/new
  def new
    @job = Job.new
  end

  # GET /tenants/1/edit
  def edit
  end

  def login
  end

  def auth
    client = Signet::OAuth2::Client.new(clientOptions)
    session[:user_type] = "tenant"
    redirect_to client.authorization_uri.to_s
  end

  # Goes to tenant profile.html.erb page
  def profile
  end

end
