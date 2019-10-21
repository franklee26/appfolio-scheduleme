require 'test_helper'

class HomepageControllerTest < ActionDispatch::IntegrationTest
  test "GET homepage success" do
    get "/"
    assert_response :success
  end

end
