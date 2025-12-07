module Api
  module V1
    class ConfigController < ApplicationController
      # GET /api/v1/config/maps_key
      def maps_key
        render json: { 
          api_key: Rails.application.credentials.dig(:google_maps, :api_key) 
        }
      end
    end
  end
end