class LandownersController < ApplicationController
  protect_from_forgery :except => [:add_tenant, :destroy_tenant]

  def index
    render json: Landowner.all, status: :ok
  end

  def get
    landowner = Landowner.find_by(id: params[:landowner_id])
    response = {
      "id": landowner.id,
      "name": landowner.name,
      "email": landowner.email,
      "created_at": landowner.created_at,
      "updated_at": landowner.updated_at,
      "tenants": landowner.tenants
    }
    render json: response, status: :ok
  end

  # GET /landowners/1
  # Returns a json containing all the fields for the landowner
  def show
    @landowner = Landowner.find(params[:id])
    render json: @landowner
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

  def auth
    client = Signet::OAuth2::Client.new(clientOptions)
    session[:user_type] = "landowner"
    redirect_to client.authorization_uri.to_s
  end


  # Goes to landowner's profile.html.erb page
  def profile
  end

end
