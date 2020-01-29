class RemoveTenantIdFromJob < ActiveRecord::Migration[5.1]
  def change
    remove_column :jobs, :Tenant_id, :integer
  end
end
