class Job < ApplicationRecord
    belongs_to :vendor
    belongs_to :tenant
    validates :content, length: { maximum: 140 }, presence: true
end
