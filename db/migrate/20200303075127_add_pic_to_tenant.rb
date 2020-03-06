class AddPicToTenant < ActiveRecord::Migration[5.1]
  def change
    add_column :tenants, :profile_pic, :string, default: "https://scheduleme.s3-us-west-1.amazonaws.com/missing_300x300.png"
  end
end
