class VendorsController < ApplicationController
  protect_from_forgery :except => [:update_vendor]

  def index
    @vendor = Vendor.all.sort { |t1, t2| t1.id <=> t2.id }
    response = []
    @vendor.each do |v|
      vendor_obj = {
        "id": v.id,
        "name": v.name,
        "occupation": v.occupation,
        "email": v.email,
        "created_at": v.created_at,
        "updated_at": v.updated_at,
        "landowners": v.landowners
      }
      response << vendor_obj
    end
    render json: response, status: :ok
  end

  # PATCH /vendors/update_vendor  
  # expects json in the form:
=begin
  {
    "name": "name",
    "email": "email",
    "vendor_id": 10,
    "occupation": "test",
    "zip": "12334"
  }
=end
def update_vendor
  body = JSON(request.body.read)
  name = body["name"]
  email = body["email"]
  vendor_id = body["vendor_id"]
  occupation = body["occupation"]
  zip = body["zip"]
  response = {}
  @vendor = Vendor.find_by(id: vendor_id)
  if Vendor.find_by(id: vendor_id) && name.class == String && email.class == String && occupation.class == String && zip.class == String 
    @vendor.update_attribute(:name, name)
    @vendor.update_attribute(:email, email)
    @vendor.update_attribute(:occupation, occupation)
    @vendor.update_attribute(:zip, zip)
    response = {
      code: 200,
      name: name,
      email: email,
      zip: zip,
      occupation: occupation,
      vendor_id: vendor_id
    }
  else
    response = {
      code: 400,
      vendor_id: vendor_id
    }
  end
  render json: response, status: :ok
end

  # GET /vendor/1
  # Returns a json containing all the fields for the vendor
  def show
    vendor = Vendor.find(params[:id])
    response = {
      "id": vendor.id,
      "name": vendor.name,
      "occupation": vendor.occupation,
      "email": vendor.email,
      "created_at": vendor.created_at,
      "updated_at": vendor.updated_at,
      "landowners": vendor.landowners,
      "zip": vendor.zip
    }
    render json: response, status: :ok
  end

  def search
    @vendor = Vendor.all.sort { |t1, t2| t1.id <=> t2.id }
  end

  # Goes to vendor profile.html.erb page
  def profile
  end

  def auth
    client = Signet::OAuth2::Client.new(clientOptions)
    session[:user_type] = "vendor"
    redirect_to client.authorization_uri.to_s
  end
	
end
