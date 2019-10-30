class HomepageController < ApplicationController
  def index
    @tenants = Tenant.all.sort { |t1, t2| t1.id <=> t2.id }
  end
end
