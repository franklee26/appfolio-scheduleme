class AddStartToJobs < ActiveRecord::Migration[5.1]
  def change
    add_column :jobs, :start, :datetime
  end
end
