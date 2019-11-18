class AddVendorToJobs < ActiveRecord::Migration[5.1]
  def change
    add_column :jobs, :Vendor_id, :integer
  end
end
