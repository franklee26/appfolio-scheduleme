class AddPasswordDigestToTenants < ActiveRecord::Migration[5.1]
  def change
    add_column :tenants, :password_digest, :string
  end
end
