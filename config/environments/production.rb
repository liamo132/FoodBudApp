require "active_support/core_ext/integer/time"

Rails.application.configure do
  # Settings specified here will take precedence over those in config/application.rb.

  # Code is not reloaded between requests.
  config.enable_reloading = false

  # Eager load code on boot for better performance.
  config.eager_load = true

  # Full error reports are disabled.
  config.consider_all_requests_local = false

  # Cache control headers for static files.
  config.public_file_server.headers = {
    "Cache-Control" => "public, max-age=#{1.year.to_i}"
  }

  # Store uploaded files locally (fine for Render free tier).
  config.active_storage.service = :local

  # Log to STDOUT for Render.
  config.log_tags = [:request_id]
  config.logger   = ActiveSupport::TaggedLogging.logger(STDOUT)

  config.log_level = ENV.fetch("RAILS_LOG_LEVEL", "info")
  config.silence_healthcheck_path = "/up"
  config.active_support.report_deprecations = false

  # ------------------------------------------------------------------------------------
  # DISABLE RAILS 8 SOLID CACHE / SOLID QUEUE / MULTI-DB FEATURES (REQUIRED ON RENDER)
  # ------------------------------------------------------------------------------------

  # Disable SolidCache (Rails 8 default, requires extra DB tables)
  config.cache_store = :null_store

  # Disable SolidQueue, which is causing the "queue database not configured" crash
  config.active_job.queue_adapter = :async

  if config.respond_to?(:solid_queue)
    config.solid_queue.enabled = false rescue nil
    config.solid_queue = nil rescue nil
  end

  # ------------------------------------------------------------------------------------

  # Default host for URL helpers in emails (not used in API-only apps)
  config.action_mailer.default_url_options = { host: "example.com" }

  # Enable I18n fallbacks.
  config.i18n.fallbacks = true

  # Don't dump schema after migrations.
  config.active_record.dump_schema_after_migration = false

  # Only show ID in inspect output.
  config.active_record.attributes_for_inspect = [:id]

  # DNS rebinding protection (optional for Render – leave disabled)
  # config.hosts = []
end
