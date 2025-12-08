# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#

# Remove pre-populated Dublin data so seeds stay location-agnostic.
# Add any starter records you want below; by default we leave the database empty.
Restaurant.destroy_all

puts "Seeds cleared. Restaurant count: #{Restaurant.count}"
