class TenantsController < ApplicationController 
  protect_from_forgery :except => [:update_tenant]

  # Returns json of all the fields or every tenant
  def index
    render json: Tenant.all, status: :ok
  end

  def no_landowner
    render json: Tenant.where(landowner_id: 0), status: :ok
  end

  def get_freebusy
    tenant = Tenant.find(params[:id])
    render json: tenant.freebusies, status: :ok
  end

  # GET /tenants/1
  # Returns a json containing all the fields for the tenant
  def show
    @tenant = Tenant.find(params[:id])
    tenant_jobs = []

    @tenant.jobs.each do |j|
      job_obj = {
        id: j.id,
        content: j.content,
        created_at: j.created_at,
        updated_at: j.updated_at,
        title: j.title,
        job_type: j.job_type,
        status: j.status,
        tenant_id: j.tenant_id,
        vendor_id: j.vendor_id,
        start: j.start,
        end: j.end,
        vendor_name: j.vendor.name,
        reviewed: j.reviewed,
        vendor_rating: j.vendor.rating == nil ? 0 : j.vendor.rating
      }
      tenant_jobs << job_obj
    end
    response = {
      "id": @tenant.id,
      "name": @tenant.name,
      "created_at": @tenant.created_at,
      "updated_at": @tenant.updated_at,
      "email": @tenant.email,
      "landowner_id": @tenant.landowner_id,
      "street_address": @tenant.street_address,
      "city": @tenant.city,
      "state": @tenant.state,
      "zip": @tenant.zip,
      "profile_pic": @tenant.profile_pic,
      "phone_number": @tenant.phone_number,
      "jobs": tenant_jobs,
      "has_approved_job": (@tenant.jobs.map { |j| j.status }.include? 'LANDOWNER APPROVED')
    }
    render json: response
  end

  # GET /tenants/new
  def new
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
    profile = body["profile_pic"]
    phone_number = body["phone_number"]
    response = {}
    @tenant = Tenant.find_by(id: tenant_id)
    if Tenant.find_by(id: tenant_id) && (Landowner.find_by(id: landowner_id)||landowner_id == 0)
      @tenant.update_attribute(:landowner_id, landowner_id)
      if name.class == String 
        @tenant.update_attribute(:name, name)
      end
      if email.class == String 
        @tenant.update_attribute(:email, email)
      end
      if phone_number.class == String 
        @tenant.update_attribute(:phone_number, phone_number)
      end
      if street_address.class == String
        @tenant.update_attribute(:street_address, street_address)
      end
      if city.class == String 
        @tenant.update_attribute(:city, city)
      end
      if zip.class == String
        @tenant.update_attribute(:zip, zip)
      end
      if state.class == String
        @tenant.update_attribute(:state, state)
      end
      if profile.class == String
        @tenant.update_attribute(:profile_pic, profile)
      end
      response = {
        code: 200,
        tenant_id: tenant_id,
        name: name,
        email: email,
        landowner_id: landowner_id,
        street_address: street_address,
        city: city,
        zip: zip,
        state: state,
        profile_pic: profile
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

  def auth
    client = Signet::OAuth2::Client.new(clientOptions)
    session[:user_type] = "tenant"
    redirect_to client.authorization_uri.to_s
  end
end
