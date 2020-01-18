class LandownersController < ApplicationController
  protect_from_forgery :except => [:add_tenant]

  def index
    render json: Landowner.all, status: :ok
  end

  def get
    render json: Landowner.find_by(id: params[:landowner_id]), status: :ok
  end

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
        code: 400
      }
    end
    render json: response, status: :ok
  end

  def tenants
    landowner_id = params[:landowner_id]
    render json: Landowner.find_by(id: landowner_id).tenants, status: :ok
  end

  def auth
    client = Signet::OAuth2::Client.new(clientOptions)
    session[:user_type] = "landowner"
    redirect_to client.authorization_uri.to_s
  end
end
