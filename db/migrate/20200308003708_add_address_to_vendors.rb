class AddAddressToVendors < ActiveRecord::Migration[5.1]
  def change
    add_column :vendors, :street_address, :string
    add_column :vendors, :city, :string
    add_column :vendors, :state, :string
  end
end
