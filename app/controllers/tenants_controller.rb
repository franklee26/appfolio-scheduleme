class TenantsController < ApplicationController
  def index
    render json: Tenant.all, status: :ok
  end

  def no_landowner
    render json: Tenant.where(landowner_id: 0), status: :ok
  end

  # GET /tenants/1
  # GET /tenants/1.json
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

  def profile
  end

end
