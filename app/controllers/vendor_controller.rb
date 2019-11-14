class VendorController < ApplicationController
	def show
		# as a placeholder pass in a list of all tenants but later pass in all tenants that fit the search criteria
    	@vendor = Vendor.all.sort { |t1, t2| t1.id <=> t2.id }
  	end

  	def index
  		@vendor = Vendor.all.sort { |t1, t2| t1.id <=> t2.id }
  	end

  	def profile
  	end
end
