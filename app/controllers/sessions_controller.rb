class SessionsController < ApplicationController
  def new
  end
  def create
  end
  def destroy
  end
  def login(json_response)
    email = json_response["email"]
    name = json_response["name"]
    user_type = sessions[:user_type]
    
    @user = find_or_create_user(name, email, user_type)
    sessions[:user_id] = user.id
  end
  def landing_page
  end
  def profile_page
  end
  private
  def current_user
    user_type = sessions[:user_type]
    if user_type == "tenant"
      @current_user ||= Tenant.find_by(id: sessions[:user_id])
    elsif user_type == "landowner"
      @current_user ||= Landowner.find_by(id: sessions[:user_id])
    elsif user_type == "vendor"
      @current_user ||= Vendor.find_by(id: sessions[:user_id])
    else
      nil
    end
  end

  def find_or_create_user(name, email, user_type)
    if user_type == "tenant"
      potential_tenant = Tenant.find_by(email: email)
      if Tenant.find_by(email: email)
        potential_tenant
      else
        Tenant.create(id: Tenant.last ? Tenant.last.id + 1 : 0, name: name, email: email)
      end
    elsif user_type == "landowner"
      potential_landowner = Landowner.find_by(email: email)
      if Landowner.find_by(email: email)
        potential_landowner
      else
        Landowner.create(id: Landowner.last ? Landowner.last.id + 1 : 0, name: name, email: email)
      end
    else
      potential_vendor = Vendor.find_by(email: email)
      if Vendor.find_by(email: email)
        potential_vendor
      else
        Vendor.create(id: Vendor.last ? Vendor.last.id + 1 : 0, name: name, email: email)
    end
  end
end
