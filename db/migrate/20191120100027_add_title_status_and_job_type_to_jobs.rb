class AddTitleStatusAndJobTypeToJobs < ActiveRecord::Migration[5.1]
    def change
  	add_column :jobs, :title, :string
  	add_column :jobs, :job_type, :string
  	add_column :jobs, :status, :string
  end
end
