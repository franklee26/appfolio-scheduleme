class Job < ApplicationRecord
    belongs_to :Tenant
    validates :content, length: { maximum: 140 },
        presence: true
end
