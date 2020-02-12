class AddAuthTokenToTenants < ActiveRecord::Migration[5.1]
  def change
  	add_column :tenants, :auth_token, :string
  	add_column :tenants, :refresh_token, :string
  end
end
