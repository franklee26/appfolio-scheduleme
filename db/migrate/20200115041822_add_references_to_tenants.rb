class AddReferencesToTenants < ActiveRecord::Migration[5.1]
  def change
    add_reference :tenants, :landowner, foreign_key: true
  end
end
