json.extract! @job, :id, :content, :Tenant_id, :created_at, :updated_at
json.errors @job.errors.full_messages