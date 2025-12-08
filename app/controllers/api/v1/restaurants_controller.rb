module Api
  module V1
    class RestaurantsController < ApplicationController
      before_action :set_restaurant, only: [:show, :update, :destroy]

      # GET /api/v1/restaurants
      def index
        @restaurants = Restaurant.all
        render json: @restaurants
      end

      # GET /api/v1/restaurants/:id
      def show
        render json: @restaurant
      end

      # POST /api/v1/restaurants
      def create
        @restaurant = Restaurant.new(restaurant_params)

        if @restaurant.save
          render json: @restaurant, status: :created
        else
          render json: @restaurant.errors, status: :unprocessable_entity
        end
      end

      # PATCH/PUT /api/v1/restaurants/:id
      def update
        if @restaurant.update(restaurant_params)
          render json: @restaurant
        else
          render json: @restaurant.errors, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/restaurants/:id
      def destroy
        @restaurant.destroy
        head :no_content
      end

      # GET /api/v1/restaurants/search
      def search
        @restaurants = Restaurant.all

        # Filter by keyword
        if params[:keyword].present?
          keyword = params[:keyword].downcase
          @restaurants = @restaurants.where(
            "LOWER(cuisine) LIKE ? OR LOWER(name) LIKE ?",
            "%#{keyword}%",
            "%#{keyword}%"
          )
        end

        # Filter by radius (results come back sorted by distance from Geocoder)
        if params[:latitude].present? && params[:longitude].present?
          latitude = params[:latitude].to_f
          longitude = params[:longitude].to_f
          radius = (params[:radius] || 25).to_f

          @restaurants = @restaurants.near([latitude, longitude], radius, units: :km)
        end

        # Include distance in response so the frontend can show/sort by proximity
        render json: @restaurants.as_json(methods: :distance)
      end

      private

      def set_restaurant
        @restaurant = Restaurant.find(params[:id])
      end

      def restaurant_params
        params.require(:restaurant).permit(:name, :cuisine, :address, :website, :latitude, :longitude, :user_added)
      end
    end
  end
end
