# config/initializers/cors.rb

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    # Frontend production URL
    origins 'https://foodbud-frontend.onrender.com',
            # Local dev (Vite)
            'http://localhost:5173',
            # Optional: other local ports if you used them
            'http://localhost:3000',
            'http://localhost:3001'

    resource '*',
      headers: :any,
      expose: ['Authorization'],
      methods: [:get, :post, :put, :patch, :delete, :options, :head]
  end
end
