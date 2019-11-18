class Job < ApplicationRecord
    belongs_to :Tenant
    belongs_to :Vendor
    validates :content, length: { maximum: 140 },
        presence: true
end
