class RestaurantsController < ApplicationController
  before_action :set_restaurant, only: %i[ show edit update destroy ]

  # GET /restaurants or /restaurants.json
  def index
    @restaurants = Restaurant.all
  end

  # GET /restaurants/1 or /restaurants/1.json
  def show
  end

  # GET /restaurants/new
  def new
    @restaurant = Restaurant.new
  end

  # GET /restaurants/1/edit
  def edit
  end

  # POST /restaurants or /restaurants.json
  def create
    @restaurant = Restaurant.new(restaurant_params)

    respond_to do |format|
      if @restaurant.save
        format.html { redirect_to @restaurant, notice: "Restaurant was successfully created." }
        format.json { render :show, status: :created, location: @restaurant }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @restaurant.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /restaurants/1 or /restaurants/1.json
  def update
    respond_to do |format|
      if @restaurant.update(restaurant_params)
        format.html { redirect_to @restaurant, notice: "Restaurant was successfully updated.", status: :see_other }
        format.json { render :show, status: :ok, location: @restaurant }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @restaurant.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /restaurants/1 or /restaurants/1.json
  def destroy
    @restaurant.destroy!

    respond_to do |format|
      format.html { redirect_to restaurants_path, notice: "Restaurant was successfully destroyed.", status: :see_other }
      format.json { head :no_content }
    end
  end

    # Search action - filters restaurants by keyword and radius
  def search
    # Start with all restaurants
    @restaurants = Restaurant.all
    
    # Filter by keyword if provided
    # Searches in both cuisine and name fields (case-insensitive)
    if params[:keyword].present?
      keyword = params[:keyword].downcase  # Convert to lowercase for case-insensitive search
      @restaurants = @restaurants.where(
        "LOWER(cuisine) LIKE ? OR LOWER(name) LIKE ?",  # SQL LOWER() for case-insensitive
        "%#{keyword}%",  # % wildcards mean "contains" (e.g., "piz" matches "pizza")
        "%#{keyword}%"
      )
    end
    
    # Filter by radius if user location coordinates are provided
    if params[:latitude].present? && params[:longitude].present?
      latitude = params[:latitude].to_f   # Convert string to float
      longitude = params[:longitude].to_f
      radius = params[:radius] || 25      # Default to 25km if not specified
      
      # Geocoder's 'near' method finds restaurants within X km of coordinates
      # Uses Haversine formula to calculate distances on Earth's surface
      @restaurants = @restaurants.near([latitude, longitude], radius, units: :km)
    end
    
    # Render the index view (reuse the same template)
    render :index
  end
  
  private
    # Use callbacks to share common setup or constraints between actions.
    def set_restaurant
      @restaurant = Restaurant.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def restaurant_params
      params.expect(restaurant: [ :name, :cuisine, :address, :website, :latitude, :longitude, :user_added ])
    end
end
