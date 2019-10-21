require 'test_helper'

class TenantTest < ActiveSupport::TestCase
  def setup
    @tenant = Tenant.new(name: "Michael Jackson")
  end

  test "Tenant should be valid" do
    assert @tenant.valid?
  end

end
