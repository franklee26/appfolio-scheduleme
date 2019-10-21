require 'test_helper'

class AboutControllerTest < ActionDispatch::IntegrationTest
  test "GET about success" do
    get "/about"
    assert_response :success
  end

end
