class AddEndToJobs < ActiveRecord::Migration[5.1]
  def change
    add_column :jobs, :end, :datetime
  end
end
