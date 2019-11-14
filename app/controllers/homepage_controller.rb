class HomepageController < ApplicationController
  def index
	@tenants = Tenant.all.sort { |t1, t2| t1.id <=> t2.id }
  	@landowners = Landowner.all.sort { |l1, l2| l1.id <=> l2.id }
  	@vendors = Vendor.all.sort { |l1, l2| l1.id <=> l2.id }
  end
end
