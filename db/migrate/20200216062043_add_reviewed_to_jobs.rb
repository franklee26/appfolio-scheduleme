class AddReviewedToJobs < ActiveRecord::Migration[5.1]
  def change
    add_column :jobs, :reviewed, :boolean
  end
end
