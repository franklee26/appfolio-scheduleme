require 'test_helper'

class TenantsControllerTest < ActionDispatch::IntegrationTest
  test "should get new" do
    get tenants_new_url
    assert_response :success
  end

end
