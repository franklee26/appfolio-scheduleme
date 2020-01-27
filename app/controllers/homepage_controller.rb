class HomepageController < ApplicationController
  def index
	@tenants = Tenant.all.select { |t| t.id != 0 }.sort { |t1, t2| t1.id <=> t2.id }
  	@landowners = Landowner.all.select { |l| l.id != 0 }.sort { |l1, l2| l1.id <=> l2.id }
  	@vendors = Vendor.all.select { |v| v.id != 0 }.sort { |l1, l2| l1.id <=> l2.id }
  end
end
