class TenantController < ApplicationController
  def index
    @tenants = Tenant.all
  end
end
