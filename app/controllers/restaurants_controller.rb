class RestaurantsController < ApplicationController
  before_action :set_restaurant, only: %i[ show edit update destroy ]

   # GET /restaurants or /restaurants.json
  def index
    # Always show ALL restaurants for the map
    @restaurants = Restaurant.all
    
    # Set default location (Dublin)
    @latitude = 53.3498
    @longitude = -6.2603
    @radius = 25
  end

  # Search action - filters restaurants by keyword and radius
  def search
    # Start with all restaurants (for the map - always visible)
    @restaurants = Restaurant.all
    
    # Store search parameters for Google Places
    if params[:latitude].present? && params[:longitude].present?
      @latitude = params[:latitude].to_f
      @longitude = params[:longitude].to_f
      @radius = params[:radius] || 25
    else
      @latitude = 53.3498
      @longitude = -6.2603
      @radius = 25
    end
    
    # Note: We DON'T filter @restaurants here anymore
    # All database restaurants are always shown on the map
    # Only Google Places results are filtered by search
    
    render :index
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
        format.html { redirect_to restaurants_path, notice: "Restaurant was successfully created." }
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
        format.html { redirect_to restaurants_path, notice: "Restaurant was successfully updated.", status: :see_other }
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

    
    # Filter by radius if user location coordinates are provided
    # These coordinates come from the browser's geolocation API (via JavaScript)
    if params[:latitude].present? && params[:longitude].present?
      @latitude = params[:latitude].to_f    # Store for view to use
      @longitude = params[:longitude].to_f
      @radius = params[:radius] || 25
      
      # Geocoder's 'near' method finds restaurants within X km of coordinates
      # Uses Haversine formula to calculate distances on Earth's surface
      @restaurants = @restaurants.near([@latitude, @longitude], @radius, units: :km)
    else
      # No location provided - set defaults (Dublin city center)
      @latitude = 53.3498
      @longitude = -6.2603
      @radius = 25
    end
    
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
