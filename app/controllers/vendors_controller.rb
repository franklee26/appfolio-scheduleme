class VendorsController < ApplicationController

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
      "landowners": vendor.landowners
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
