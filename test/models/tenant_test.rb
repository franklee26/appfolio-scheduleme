require 'test_helper'

class TenantTest < ActiveSupport::TestCase
  def setup
    @tenant = Tenant.new(name: "Michael Jackson", email:"tenant@example.com")
  end

  test "Tenant should be valid" do
    assert @tenant.valid?
  end

  test "name should be present" do
    @tenant.name = ""
    assert_not @tenant.valid?
  end

  test "name should not be too long" do
    @tenant.name = "a" * 51
    assert_not @tenant.valid?
  end

  test "email should not be too long" do
    @tenant.email = "a" * 244 + "@example.com"
    assert_not @tenant.valid?
  end

  test "email validation should accept valid addresses" do
    valid_addresses = %w[user@example.com USER@foo.COM A_US-ER@foo.bar.org first.last@foo.jp alice+bob@baz.cn]
    valid_addresses.each do |valid_address|
      @tenant.email = valid_address
      assert @tenant.valid?, "#{valid_address.inspect} should be valid"
      end
  end

  test "email validation should reject invalid addresses" do
    invalid_addresses = %w[user@example,com user_at_foo.org user.name@example. foo@bar_baz.com foo@bar+baz.com]
    invalid_addresses.each do |invalid_address|
      @tenant.email = invalid_address
      assert_not @tenant.valid?, "#{invalid_address.inspect} should be invalid"
    end
  end

  test "email addresses should be unique" do
    duplicate_user = @tenant.dup
    duplicate_user.email = @tenant.email.upcase
    @tenant.save
    assert_not duplicate_user.valid?
  end    

end
