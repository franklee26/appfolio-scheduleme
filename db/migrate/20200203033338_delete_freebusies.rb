class DeleteFreebusies < ActiveRecord::Migration[5.1]
  def change
    drop_table :freebusies
  end
end