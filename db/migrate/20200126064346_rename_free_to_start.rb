class RenameFreeToStart < ActiveRecord::Migration[5.1]
  def change
    rename_column :freebusies, :free, :start
  end
end
