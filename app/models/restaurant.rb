class Restaurant < ApplicationRecord
  geocoded_by :address
  after_validation :geocode, if: :address_changed?
  
  validates :name, :cuisine, :address, presence: true
  
  #scopes for filtering
  scope :user_added, -> { where(user_added: true) }
  scope :searched, -> { where(user_added: false) }
end