require "test_helper"

class RestaurantTest < ActiveSupport::TestCase
  def setup
    @bunsen = restaurants(:bunsen)
    @user_pick = restaurants(:user_pick)
  end

  test "is valid with all required attributes" do
    restaurant = Restaurant.new(
      name: "New Place",
      cuisine: "Fusion",
      address: "987 New Address, Dublin",
      website: "https://newplace.test",
      user_added: true
    )

    assert restaurant.valid?
  end

  test "requires name, cuisine, and address" do
    restaurant = Restaurant.new

    assert_not restaurant.valid?
    assert_includes restaurant.errors[:name], "can't be blank"
    assert_includes restaurant.errors[:cuisine], "can't be blank"
    assert_includes restaurant.errors[:address], "can't be blank"
  end

  test "scopes separate user-added and searched restaurants" do
    assert_includes Restaurant.user_added, @user_pick
    assert_not_includes Restaurant.user_added, @bunsen

    assert_includes Restaurant.searched, @bunsen
    assert_not_includes Restaurant.searched, @user_pick
  end

  test "geocodes on create when address is present" do
    restaurant = Restaurant.create!(
      name: "Geo Test",
      cuisine: "Test",
      address: "987 New Address, Dublin"
    )

    assert_in_delta 53.36, restaurant.latitude, 0.001
    assert_in_delta(-6.25, restaurant.longitude, 0.001)
  end

  test "updates coordinates when address changes" do
    restaurant = Restaurant.create!(
      name: "Old Address",
      cuisine: "Test",
      address: "111 Old Address, Dublin"
    )
    assert_in_delta 53.32, restaurant.latitude, 0.001
    assert_in_delta(-6.24, restaurant.longitude, 0.001)

    restaurant.update!(address: "987 New Address, Dublin")

    assert_in_delta 53.36, restaurant.latitude, 0.001
    assert_in_delta(-6.25, restaurant.longitude, 0.001)
  end
end
