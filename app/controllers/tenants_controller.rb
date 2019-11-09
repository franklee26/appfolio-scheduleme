class TenantsController < ApplicationController
  def new
  end
  def login
  end
  def show
    @tenant = Tenant.find(params[:id])
  end
end
