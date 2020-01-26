class CreateJoinTableLandownersVendors < ActiveRecord::Migration[5.1]
  def change
    create_join_table :landowners, :vendors do |t|
      t.index [:landowner_id, :vendor_id]
      t.index [:vendor_id, :landowner_id]
    end
  end
end
