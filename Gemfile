source "https://rubygems.org"

gem "rails", "~> 8.1.1"
gem "pg", "~> 1.1"
gem "puma", ">= 5.0"

# REMOVE:
# gem "solid_cache"
# gem "solid_queue"
# gem "solid_cable"

gem "geocoder"
gem "rack-cors", require: "rack/cors"

# REMOVE ActiveStorage-related gems
# gem "image_processing", "~> 1.2"

gem "bootsnap", require: false
gem "kamal", require: false
gem "thruster", require: false

group :development, :test do
  gem "debug", platforms: %i[mri windows], require: "debug/prelude"
  gem "bundler-audit", require: false
  gem "brakeman", require: false
  gem "rubocop-rails-omakase", require: false
end
