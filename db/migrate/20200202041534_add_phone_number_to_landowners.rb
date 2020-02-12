class AddPhoneNumberToLandowners < ActiveRecord::Migration[5.1]
  def change
    add_column :landowners, :phone_number, :string
  end
end
