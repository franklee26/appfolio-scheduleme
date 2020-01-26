class Freebusy < ApplicationRecord
    belongs_to :tenant
    belongs_to :landowner
    belongs_to :vendor
end
