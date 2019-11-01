require 'test_helper'

class TenantTest < ActiveSupport::TestCase
  def setup
    @tenant = Tenant.new(name: "Michael Jackson")
  end

  test "Tenant should be valid" do
    assert @tenant.valid?
  end

  test "Name should be present" do
    @tenant.name=""
    assert_not @tenant.valid?
  end

end
