require 'test_helper'

class TenantControllerTest < ActionDispatch::IntegrationTest
  test "should get new" do
    get tenant_new_url
    assert_response :success
  end

end
