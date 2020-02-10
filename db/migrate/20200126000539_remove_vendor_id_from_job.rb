class RemoveVendorIdFromJob < ActiveRecord::Migration[5.1]
  def change
    remove_column :jobs, :Vendor_id, :integer
  end
end
