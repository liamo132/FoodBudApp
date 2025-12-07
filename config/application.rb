require_relative "boot"

# Load ONLY the frameworks needed for an API-only Rails backend
require "rails"
require "active_model/railtie"
require "active_job/railtie"
require "active_record/railtie"
require "action_controller/railtie"
# DO NOT LOAD:
# require "action_mailer/railtie"
# require "active_storage/engine"
# require "action_mailbox/engine"
# require "action_text/engine"
# require "action_view/railtie"
# require "action_cable/engine"
# require "rails/test_unit/railtie"

Bundler.require(*Rails.groups)

module Backend
  class Application < Rails::Application
    config.load_defaults 8.1

    # Disable SolidQueue entirely by using async jobs
    config.active_job.queue_adapter = :async

    # API-only mode
    config.api_only = true

    config.autoload_lib(ignore: %w[assets tasks])
  end
end
