class SessionsController < ApplicationController
  def new
  end
  def create
    tenant = Tenant.find_by(email: params[:session][:email].downcase)
    if tenant
      log_in tenant
      redirect_to tenant
    else
      flash.now[:danger] = 'Invalid email/password combination'
      render 'new'
    end

  end
  def destroy
    log_out
    redirect_to root_url
  end
  def post(json_response)
  end
end
