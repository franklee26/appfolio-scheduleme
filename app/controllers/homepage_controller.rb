class HomepageController < ApplicationController
  def index
    @tenants = Tenant.all
  end
end
