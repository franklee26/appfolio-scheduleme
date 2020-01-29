class AddLandownerToFreebusy < ActiveRecord::Migration[5.1]
  def change
    add_reference :freebusies, :landowner, foreign_key: true
  end
end
