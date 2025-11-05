json.extract! restaurant, :id, :name, :cuisine, :address, :website, :latitude, :longitude, :user_added, :created_at, :updated_at
json.url restaurant_url(restaurant, format: :json)
