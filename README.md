# Ruby on Rails API-fied Devise for SPA-s

## Steps to take

1) Add gems gem `devise`, `devise-jwt`, `rack-cors` and initialize
2) Add `initializers/cors.rb`
3) Configure `devise-jwt` block in devise initializer
4) Disable session store `Rails.application.config.session_store :disabled` in `initializers/session_store.rb`
5) Add `protect_from_forgery with: :null_session` to `ApplicationController` (Invalid Authenticity Token)
6) Add `include Devise::JWT::RevocationStrategies::JTIMatcher` and `:jwt_authenticatable, jwt_revocation_strategy: self` to model
7) Add `clear_respond_to` and `respond_to :json` to Devise controllers
8) Add `config.middleware.use ActionDispatch::Flash` to `config/application.rb`
9) Add `failure_app` file and write config in `initializers/devise.rb`
10) Make sure devise routes have `defaults: {format: :json}` for `.json` requests
11) Clear `navigational_formats` array in `initializers/devise.rb`: `config.navigational_formats = [:json]`
