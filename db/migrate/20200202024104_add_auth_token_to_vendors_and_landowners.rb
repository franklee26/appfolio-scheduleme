class AddAuthTokenToVendorsAndLandowners < ActiveRecord::Migration[5.1]
  def change
  	add_column :vendors, :auth_token, :string
  	add_column :vendors, :refresh_token, :string
  	add_column :landowners, :auth_token, :string
  	add_column :landowners, :refresh_token, :string
  end
end
