class AddZipToVendors < ActiveRecord::Migration[5.1]
  def change
    add_column :vendors, :zip, :string
  end
end
