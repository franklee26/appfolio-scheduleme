class CreateReviews < ActiveRecord::Migration[5.1]
  def change
    create_table :reviews do |t|
      t.belongs_to :job, foreign_key: true
      t.string :text
      t.float :rating

      t.timestamps
    end
  end
end
