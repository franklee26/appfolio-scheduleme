json.content flash[:content]
json.extract! @job, :content, :vendor_id, :tenant_id
json.edit_path edit_job_path(@job)
json.back_path jobs_path