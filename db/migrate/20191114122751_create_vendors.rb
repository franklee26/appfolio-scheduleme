class CreateVendors < ActiveRecord::Migration[5.1]
  def change
    create_table :vendors do |t|
      t.string :name
      t.string :occupation
      t.string :email

      t.timestamps
    end
  end
end
