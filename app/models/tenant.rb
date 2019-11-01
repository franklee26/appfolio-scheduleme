class Tenant < ApplicationRecord
    validates :name, presence: true, length: { maximum: 50 }
    has_secure_password
end
