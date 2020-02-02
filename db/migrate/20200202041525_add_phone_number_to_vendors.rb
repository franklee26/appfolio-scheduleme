class AddPhoneNumberToVendors < ActiveRecord::Migration[5.1]
  def change
    add_column :vendors, :phone_number, :string
  end
end
