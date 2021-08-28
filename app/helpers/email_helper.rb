module EmailHelper
  def with_base_url(path)
    url = Rails.application.config.action_mailer.default_url_options
    port = url[:port] ? ":#{url[:port]}" : ""
    "#{url[:protocol]}://#{url[:host]}#{port}/#{path}"
  end
end