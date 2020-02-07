class Tenant < ApplicationRecord
    attr_accessor :skip_validations
    belongs_to :landowner
    has_many :jobs
    has_many :freebusies
    validates :name, presence: true, length: { maximum: 50 }
    VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i
    validates :email, presence: true, length: {maximum: 255}, format: { with: VALID_EMAIL_REGEX }, uniqueness: { case_sensitive:false }
    validates :phone_number, presence: true, length: {maximum: 10}, unless: :skip_validations
end
