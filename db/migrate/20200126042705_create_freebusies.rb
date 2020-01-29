class CreateFreebusies < ActiveRecord::Migration[5.1]
  def change
    create_table :freebusies do |t|
      t.datetime :free

      t.timestamps
    end
  end
end
