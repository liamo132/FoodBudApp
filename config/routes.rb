Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :restaurants do
        collection do
          get 'search'
          post 'search' # allow POST for search requests from tests/clients
        end
      end
      
      # Config endpoint for frontend
      get 'config/maps_key', to: 'config#maps_key'
    end
  end
  
  get "up" => "rails/health#show", as: :rails_health_check
end
