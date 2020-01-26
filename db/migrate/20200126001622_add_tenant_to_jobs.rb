class AddTenantToJobs < ActiveRecord::Migration[5.1]
  def change
    add_reference :jobs, :tenant, foreign_key: true
  end
end
