class VendorController < ApplicationController
	def index
    	@vendor = Vendor.all.sort { |t1, t2| t1.id <=> t2.id }
  	end
end
