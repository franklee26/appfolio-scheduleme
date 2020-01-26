json.extract! job, :id, :content, :created_at, :updated_at, :tenant_id, :vendor_id
json.url job_url(job, format: :json)
