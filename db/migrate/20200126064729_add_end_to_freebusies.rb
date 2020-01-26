class AddEndToFreebusies < ActiveRecord::Migration[5.1]
  def change
    add_column :freebusies, :end, :datetime
  end
end
