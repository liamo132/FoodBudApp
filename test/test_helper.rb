ENV["RAILS_ENV"] ||= "test"
require_relative "../config/environment"
require "rails/test_help"
require "minitest/mock"
require "geocoder"

module ActiveSupport
  class TestCase
    # Run tests in parallel with specified workers
    parallelize(workers: :number_of_processors)

    # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
    fixtures :all

    # Add more helper methods to be used by all tests here...
  end
end

# Configure Geocoder to use the test lookup so no external HTTP calls are made.
Geocoder.configure(lookup: :test, ip_lookup: :test)
Geocoder::Lookup::Test.set_default_stub(
  [
    { "coordinates" => [53.34, -6.26], "address" => "Dublin" }
  ]
)

# Provide specific stubs for known addresses used in fixtures/tests for clarity.
{
  "36 Wexford Street, Dublin 2" => [53.3369, -6.2666],
  "13-14 Camden Street Lower, Dublin 2" => [53.3360, -6.2650],
  "123 College Road, Dublin" => [53.3500, -6.2600],
  "987 New Address, Dublin" => [53.3600, -6.2500],
  "111 Old Address, Dublin" => [53.3200, -6.2400]
}.each do |address, coords|
  Geocoder::Lookup::Test.add_stub(
    address,
    [{ "coordinates" => coords, "address" => address }]
  )
end
