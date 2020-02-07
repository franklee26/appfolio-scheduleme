class Landowner < ApplicationRecord
    has_many :tenants
    has_many :freebusies
    has_and_belongs_to_many :vendors
	validates :name, presence: true, length: {maximum: 50}
    VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i
    validates :email, presence: true, length: {maximum: 255}, format: { with: VALID_EMAIL_REGEX }, uniqueness: { case_sensitive:false }
end
