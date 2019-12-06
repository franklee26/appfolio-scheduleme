require 'test_helper'

class VendorTest < ActiveSupport::TestCase
  def setup
    @vendor = Vendor.new(name: "Michael Jackson", email:"vendor@example.com", occupation:"Plumber")
  end

  test "Vendor should be valid" do
    assert @vendor.valid?
  end

  test "name should be present" do
    @vendor.name = ""
    assert_not @vendor.valid?
  end

  test "name should not be too long" do
    @vendor.name = "a" * 51
    assert_not @vendor.valid?
  end

  test "email should not be too long" do
    @vendor.email = "a" * 244 + "@example.com"
    assert_not @vendor.valid?
  end

  test "email validation should accept valid addresses" do
    valid_addresses = %w[user@example.com USER@foo.COM A_US-ER@foo.bar.org first.last@foo.jp alice+bob@baz.cn]
    valid_addresses.each do |valid_address|
      @vendor.email = valid_address
      assert @vendor.valid?, "#{valid_address.inspect} should be valid"
      end
  end

  test "email validation should reject invalid addresses" do
    invalid_addresses = %w[user@example,com user_at_foo.org user.name@example. foo@bar_baz.com foo@bar+baz.com]
    invalid_addresses.each do |invalid_address|
      @vendor.email = invalid_address
      assert_not @vendor.valid?, "#{invalid_address.inspect} should be invalid"
    end
  end

  test "email addresses should be unique" do
    duplicate_user = @vendor.dup
    duplicate_user.email = @vendor.email.upcase
    @vendor.save
    assert_not duplicate_user.valid?
  end    
end
