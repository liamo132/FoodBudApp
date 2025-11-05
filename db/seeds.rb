# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#

#Im adding 10 of my fav restaurants to get us started and to see if resteraunts load correctly with
# the gem 'geocoder' that I have added for location based searching functioning

#clearing any existing data
Restaurant.destroy_all

#some of the resteraints and the street they are on/webiste

restaurants = [
  {
    name: "Bunsen",
    cuisine: "Burgers",
    address: "36 Wexford Street, Dublin 2",
    website: "https://bunsen.ie",
    user_added: false
  },
  {
    name: "777",
    cuisine: "Mexican",
    address: "7 Castle House, South Great George's Street, Dublin 2",
    website: "https://777restaurant.com",
    user_added: false
  },
  {
    name: "Hang Dai",
    cuisine: "Chinese",
    address: "13-14 Camden Street Lower, Dublin 2",
    website: "https://hangdai.ie",
    user_added: false
  },
  {
    name: "Glas",
    cuisine: "Vegan",
    address: "17 Chatham Street, Dublin 2",
    website: "https://glasrestaurant.ie",
    user_added: false
  },
  {
    name: "The Woollen Mills",
    cuisine: "Irish",
    address: "42 Lower Ormond Quay, Dublin 1",
    website: "https://www.thewoollenmill.com",
    user_added: false
  },
  {
    name: "Yamamori",
    cuisine: "Japanese",
    address: "38-39 Lower Ormond Quay, Dublin 1",
    website: "https://yamamori.ie",
    user_added: false
  },
  {
    name: "The Fumbally",
    cuisine: "Cafe",
    address: "Fumbally Lane, Dublin 8",
    website: "https://thefumbally.ie",
    user_added: false
  },
  {
    name: "Brother Hubbard",
    cuisine: "Middle Eastern",
    address: "153 Capel Street, Dublin 1",
    website: "https://brotherhubbard.ie",
    user_added: false
  },
  {
    name: "Umi Falafel",
    cuisine: "Falafel",
    address: "13 Stephen Street Lower, Dublin 2",
    website: "https://umifalafel.com",
    user_added: false
  },
  {
    name: "SuperMiss",
    cuisine: "Asian Fusion",
    address: "5 Fade Street, Dublin 2",
    website: "https://supermiss.ie",
    user_added: false
  }
]

puts "Creating #{restaurants.count} restaurants..."

restaurants.each do |restaurant_data|
  restaurant = Restaurant.create!(restaurant_data)
  puts "Created: #{restaurant.name} (#{restaurant.latitude}, #{restaurant.longitude})"
end

puts "\nSeeding complete! #{Restaurant.count} restaurants in database."