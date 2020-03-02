class AddAttachmentAvatarToTenants < ActiveRecord::Migration[5.1]
  def self.up
    change_table :tenants do |t|
      t.attachment :avatar
    end
  end

  def self.down
    remove_attachment :tenants, :avatar
  end
end
