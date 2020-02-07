json.back_path jobs_path
json.form_method "post"
json.form_path jobs_path
json.csrf_token form_authenticity_token
json.tenant_id_call @tenant_id
json.landowner_id_call @landowner_id
json.num_jobs @num_jobs
json.partial! 'jobs/form.json', job: @job