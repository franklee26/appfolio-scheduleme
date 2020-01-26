class AddTenantToFreebusy < ActiveRecord::Migration[5.1]
  def change
    add_reference :freebusies, :tenant, foreign_key: true
  end
end
