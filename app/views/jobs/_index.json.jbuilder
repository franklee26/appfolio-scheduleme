json.new_job_path new_job_path()
json.content flash[:content]
json.jobs(@jobs) do |job|
  json.extract! job, :id, :content, :Tenant_id
  json.show_path job_path(job)
  json.edit_path edit_job_path(job)
  json.destroy_path job_path(job)
end