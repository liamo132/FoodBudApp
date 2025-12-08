require "test_helper"

class Api::V1::ConfigControllerTest < ActionDispatch::IntegrationTest
  def json_response
    JSON.parse(@response.body)
  end

  test "returns maps api key payload" do
    get "/api/v1/config/maps_key", as: :json
    assert_response :success

    body = json_response
    assert_includes body.keys, "api_key"
  end
end
