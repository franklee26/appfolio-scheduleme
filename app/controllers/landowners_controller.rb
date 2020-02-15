class LandownersController < ApplicationController
  protect_from_forgery :except => [:add_tenant, :destroy_tenant, :add_vendor, :update_landowner]

  def index
    render json: Landowner.all, status: :ok
  end

  def show
    landowner = Landowner.find_by(id: params[:landowner_id])
    tenants = []
    landowner.tenants.each do |t|
      tenant_response = {
        "id": t.id,
        "name": t.name,
        "created_at": t.created_at,
        "updated_at": t.updated_at,
        "email": t.email,
        "landowner_id": t.landowner_id,
        "street_address": t.street_address,
        "city": t.city,
        "state": t.state,
        "zip": t.zip,
        "jobs": t.jobs,
      }
      tenants << tenant_response
    end
    response = {
      "id": landowner.id,
      "name": landowner.name,
      "email": landowner.email,
      "created_at": landowner.created_at,
      "updated_at": landowner.updated_at,
      "tenants": tenants,
      "vendors": landowner.vendors
    }
    render json: response, status: :ok
  end

  # PATCH /landowner/update_landowner  
  # expects json in the form:
=begin
  {
    "name": "name",
    "email": "email",
    "landowner_id": 1,
  }
=end
def update_landowner
  body = JSON(request.body.read)
  name = body["name"]
  email = body["email"]
  landowner_id = body["landowner_id"]
  response = {}
  @landowner = Landowner.find_by(id: landowner_id)
  if Landowner.find_by(id: landowner_id) && name.class == String && email.class == String
    @landowner.update_attribute(:name, name)
    @landowner.update_attribute(:email, email)
    response = {
      code: 200,
      name: name,
      email: email,
      landowner_id: landowner_id,
    }
  else
    response = {
      code: 400,
      landowner_id: landowner_id
    }
  end
  render json: response, status: :ok
end

  # Adds a tenant association to this landowner
  def add_tenant
    body = JSON(request.body.read)
    tenant_id = body["tenant_id"]
    landowner_id = body["landowner_id"]
    response = {}
    if Tenant.find_by(id: tenant_id) && Landowner.find_by(id: landowner_id)
      Landowner.find(landowner_id).tenants << Tenant.find(tenant_id)
      response = {
        code: 200,
        tenant_id: tenant_id,
        landowner_id: landowner_id
      }
    else
      response = {
        code: 400,
        tenant_id: -1,
        landowner_id: -1
      }
    end
    render json: response, status: :ok
  end

  def add_vendor
    body = JSON(request.body.read)
    vendor_id = body["vendor_id"]
    landowner_id = body["landowner_id"]
    response = {}
    if Vendor.find_by(id: vendor_id) && Landowner.find_by(id: landowner_id)
      Landowner.find(landowner_id).vendors << Vendor.find(vendor_id)
      response = {
        code: 200,
        vendor_id: vendor_id,
        landowner_id: landowner_id
      }
    else
      response = {
        code: 400,
        vendor_id: -1,
        landowner_id: -1
      }
    end
    render json: response, status: :ok
  end

  # removes the tenant association (first assigns tenant back to default, then removes)
  def destroy_tenant
    tenant_id = params[:tenant_id]
    temp = Tenant.find(tenant_id)
    temp.landowner = Landowner.first
    response = {
      "status": 400,
      "tenant_id": tenant_id
    }
    if temp.save!
      response["status"] = 200
      render json: response, status: :ok
    else
      render json: response, status: ok
    end
  end

  def destroy_vendor
    vendor_id = params[:vendor_id]
    landowner_id = params[:landowner_id]
    landowner = Landowner.find(landowner_id)
    vendor = Vendor.find(vendor_id)
    landowner.vendors.delete(vendor)
    response = {
      "status": 400,
      "landowner_id": landowner_id,
      "vendor_id": vendor_id
    }
    if landowner.save!
      response["status"] = 200
      render json: response, status: :ok
    else
      render json: response, status: ok
    end
  end

  def auth
    client = Signet::OAuth2::Client.new(clientOptions)
    session[:user_type] = "landowner"
    redirect_to client.authorization_uri.to_s
  end

end
