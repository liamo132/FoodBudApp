Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins "https://foodbud-backend.onrender.com", "http://localhost:5173"

    resource "*",
      headers: :any,
      methods: [:get, :post, :patch, :put, :delete, :options, :head]
  end
end
