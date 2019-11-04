class CreateVendors < ActiveRecord::Migration[5.1]
  def change
    create_table :vendors do |t|
      t.string :email
      t.string :name
      t.string :occupation
      t.string :email
    end
  end
end
