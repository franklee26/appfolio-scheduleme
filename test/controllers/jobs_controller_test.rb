require 'test_helper'

class JobsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @job = jobs(:one)
  end

  #index should work
  test "should get index" do
    get jobs_url
    assert_response :success
  end

  #url test
  test "should get new" do
    get new_job_url
    assert_response :success
  end

  #if url exsist then created
  test "should create job" do
    assert_difference('Job.count') do
      post jobs_url, params: { job: { Tenant_id: @job.Tenant_id, content: @job.content } }
    end

    assert_redirected_to job_url(Job.last)
  end

  #Job should exsist
  test "should show job" do
    get job_url(@job)
    assert_response :success
  end

  #If url returned then edit success
  test "should get edit" do
    get edit_job_url(@job)
    assert_response :success
  end

  #Check to see if job is updated/changed
  test "should update job" do
    patch job_url(@job), params: { job: { Tenant_id: @job.Tenant_id, content: @job.content } }
    assert_redirected_to job_url(@job)
  end

  #When a job is deleted the job count should go down and the url associated with the job should be deleted, else redirect to url
  test "should destroy job" do
    assert_difference('Job.count', -1) do
      delete job_url(@job)
    end

    assert_redirected_to jobs_url
  end
end
