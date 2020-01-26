json.extract! @job, :id, :content, :created_at, :updated_at, :tenant_id, :vendor_id
json.errors @job.errors.full_messages