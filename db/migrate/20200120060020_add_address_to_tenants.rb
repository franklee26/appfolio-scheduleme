class AddAddressToTenants < ActiveRecord::Migration[5.1]
  def change
    add_column :tenants, :street_address, :string
    add_column :tenants, :city, :string
    add_column :tenants, :state, :string
    add_column :tenants, :zip, :string
  end
end
