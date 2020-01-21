class VendorController < ApplicationController

  	def index
  		@vendor = Vendor.all.sort { |t1, t2| t1.id <=> t2.id }
  	end

	# GET /vendor/1
	# Returns a json containing all the fields for the vendor
	def show
		@vendor = Vendor.find(params[:id])
		render json: @vendor
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
