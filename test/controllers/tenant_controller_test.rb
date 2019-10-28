require 'test_helper'

class TenantControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get tenant_index_url
    assert_response :success
  end

end
