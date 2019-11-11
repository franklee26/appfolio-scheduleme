json.back_path jobs_path
json.form_method "post"
json.form_path jobs_path
json.csrf_token form_authenticity_token
json.partial! 'jobs/form.json', job: @job