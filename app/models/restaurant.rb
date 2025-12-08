class Restaurant < ApplicationRecord
  geocoded_by :address
  after_validation :geocode, if: :address_changed?
  
  validates :name, :cuisine, :address, presence: true
  
  # Scope for user-added restaurants
  scope :user_added, -> { where(user_added: true) }
  scope :searched, -> { where(user_added: false) }

  # Geocoder adds distance when using .near; provide a default nil to avoid errors when absent
  attr_accessor :distance
end
