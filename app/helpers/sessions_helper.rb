module SessionsHelper
    def log_in(tenant)
        session[:id] = tenant.id
    end
    def current_tenant
        @current_tenant ||= Tenant.find_by(id:session[:id])
    end
    def log_out
        session.delete(:tenant.id)
        @current_tenant = nil
    end
    def logged_in?
        !current_tenant.nil?
    end
end
