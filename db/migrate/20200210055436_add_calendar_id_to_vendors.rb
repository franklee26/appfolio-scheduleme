class AddCalendarIdToVendors < ActiveRecord::Migration[5.1]
  def change
    add_column :vendors, :calendar_id, :string
  end
end
