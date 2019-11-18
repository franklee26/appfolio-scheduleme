class CreateJobs < ActiveRecord::Migration[5.1]
  def change
    create_table :jobs do |t|
      t.text :content
      t.integer :Tenant_id

      t.timestamps
    end
  end
end
