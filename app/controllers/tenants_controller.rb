class TenantsController < ApplicationController 
  protect_from_forgery :except => [:update_tenant]

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

  # PATCH /tenants/update_tenant
  # expects json in the form:
=begin
  {
	  "tenant_id": 1,
    "name": "name",
    "email": "email",
    "landowner_id": 1,
    "street_address": "street_address",
    "city": "city",
    "zip": "zip",
    "state": "state"
  }
=end
  def update_tenant
    body = JSON(request.body.read)
    tenant_id = body["tenant_id"]
    name = body["name"]
    email = body["email"]
    landowner_id = body["landowner_id"]
    street_address = body["street_address"]
    city = body["city"]
    zip = body["zip"]
    state = body["state"]
    response = {}
    @tenant = Tenant.find_by(id: tenant_id)
    if Tenant.find_by(id: tenant_id) && Landowner.find_by(id: landowner_id) && name.class == String && email.class == String && street_address.class == String && city.class == String && zip.class == String && state.class == String
      @tenant.update_attribute(:landowner_id, landowner_id)
      @tenant.update_attribute(:name, name)
      @tenant.update_attribute(:email, email)
      @tenant.update_attribute(:street_address, street_address)
      @tenant.update_attribute(:city, city)
      @tenant.update_attribute(:zip, zip)
      @tenant.update_attribute(:state, state)
      response = {
        code: 200,
        tenant_id: tenant_id,
        name: name,
        email: email,
        landowner_id: landowner_id,
        street_address: street_address,
        city: city,
        zip: zip,
        state: state
      }
    else
      response = {
        code: 400,
        tenant_id: tenant_id,
        landowner_id: landowner_id
      }
    end
    render json: response, status: :ok
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
