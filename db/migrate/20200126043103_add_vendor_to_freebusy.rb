class AddVendorToFreebusy < ActiveRecord::Migration[5.1]
  def change
    add_reference :freebusies, :vendor, foreign_key: true
  end
end
