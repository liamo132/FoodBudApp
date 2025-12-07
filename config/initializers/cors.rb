Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins '*'  # for project demo; in a real system you’d restrict this
    resource '*',
      headers: :any,
      methods: %i[get post put patch delete options head]
  end
end
