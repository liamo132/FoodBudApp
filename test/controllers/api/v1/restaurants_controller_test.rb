require "test_helper"

class Api::V1::RestaurantsControllerTest < ActionDispatch::IntegrationTest
  def setup
    @bunsen = restaurants(:bunsen)
    @hang_dai = restaurants(:hang_dai)
    @user_pick = restaurants(:user_pick)
  end

  def json_response
    JSON.parse(@response.body)
  end

  test "index returns all restaurants" do
    get api_v1_restaurants_url, as: :json
    assert_response :success

    body = json_response
    assert_equal Restaurant.count, body.size
    assert_includes body.map { |r| r["name"] }, @bunsen.name
  end

  test "show returns a restaurant" do
    get api_v1_restaurant_url(@bunsen), as: :json
    assert_response :success

    body = json_response
    assert_equal @bunsen.name, body["name"]
    assert_equal @bunsen.cuisine, body["cuisine"]
  end

  test "show returns 404 for missing restaurant" do
    get api_v1_restaurant_url(-1), as: :json
    assert_response :not_found
  end

  test "creates a restaurant with valid data" do
    assert_difference("Restaurant.count", 1) do
      post api_v1_restaurants_url,
           params: {
             restaurant: {
               name: "New Spot",
               cuisine: "Italian",
               address: "987 New Address, Dublin",
               website: "https://new.example",
               user_added: true
             }
           },
           as: :json
    end

    assert_response :created
    body = json_response
    assert_equal "New Spot", body["name"]
    assert body["latitude"].present?
    assert body["longitude"].present?
  end

  test "does not create restaurant when required fields are missing" do
    assert_no_difference("Restaurant.count") do
      post api_v1_restaurants_url,
           params: { restaurant: { cuisine: "Italian" } },
           as: :json
    end

    assert_response :unprocessable_entity
    body = json_response
    assert body.key?("name")
    assert body.key?("address")
  end

  test "updates a restaurant" do
    patch api_v1_restaurant_url(@user_pick),
          params: { restaurant: { cuisine: "Brunch" } },
          as: :json
    assert_response :success

    @user_pick.reload
    assert_equal "Brunch", @user_pick.cuisine
  end

  test "does not update with invalid data" do
    original_name = @user_pick.name

    patch api_v1_restaurant_url(@user_pick),
          params: { restaurant: { name: "" } },
          as: :json
    assert_response :unprocessable_entity

    @user_pick.reload
    assert_equal original_name, @user_pick.name
  end

  test "destroys a restaurant" do
    assert_difference("Restaurant.count", -1) do
      delete api_v1_restaurant_url(@hang_dai), as: :json
    end

    assert_response :no_content
  end

  test "search filters by keyword" do
    get "/api/v1/restaurants/search", params: { keyword: "burger" }, as: :json
    assert_response :success

    names = json_response.map { |r| r["name"] }
    assert_includes names, @bunsen.name
    assert_not_includes names, @hang_dai.name
  end

  test "search filters by coordinates and radius" do
    get "/api/v1/restaurants/search",
        params: { latitude: 53.35, longitude: -6.26, radius: 5 },
        as: :json

    assert_response :success
    body = json_response || []
    assert_kind_of Array, body
    assert body.any?, "expected at least one restaurant in radius search"
    assert_includes body.map { |r| r["name"] }, @user_pick.name
  end

  test "search returns all when no filters are provided" do
    get "/api/v1/restaurants/search", as: :json
    assert_response :success

    assert_equal Restaurant.count, json_response.size
  end
end
