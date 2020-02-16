class AddNumToVendors < ActiveRecord::Migration[5.1]
  def change
    add_column :vendors, :num, :integer
    add_column :vendors, :rating, :float
  end
end
