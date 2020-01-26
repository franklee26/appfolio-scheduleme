class FreebusiesController < ApplicationController
  # this should return a json of viable vendors along with its start and end time
  def schedule
    landowner_id = params[:landowner_id]
    tenant_id = params[:tenant_id]
    # returns a list of viable vendors
    viable_vendors = get_viable_vendors(landowner_id, tenant_id)
    body = {
      vendors: viable_vendors
    }
    render json: body
  end

  private

  def get_viable_vendors(landowner_id, tenant_id)
    ans = []
    landowner = Landowner.find(landowner_id)
    tenant = Tenant.find(tenant_id)
    vendors = landowner.vendors
    
    landowner_start = landowner.freebusies.map { |l| l.start }
    tenant_start = tenant.freebusies.map { |t| t.start }
    landowner_tenant = landowner_start & tenant_start
    if not landowner_tenant
      # nothing in common among landowner_tenant
      return []
    end
    # ok so there's sitll hope
    vendors.each do |v|
      v.freebusies.each do |f|
        if ans.length >= 10
          return ans
        end
        if landowner_tenant.include? f.start
          ans << {"vendor": v, "start": f.start, "end": f.end}
        end
      end
    end
    ans
  end
end
