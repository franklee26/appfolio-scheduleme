json.show_path job_path(@job)
json.back_path jobs_path
json.form_method "put"
json.form_path job_path(@job)
json.csrf_token form_authenticity_token
json.partial! 'jobs/form.json', job: @job