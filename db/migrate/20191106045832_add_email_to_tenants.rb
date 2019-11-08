class AddEmailToTenants < ActiveRecord::Migration[5.1]
  def change
    add_column :tenants, :email, :string
  end
end
