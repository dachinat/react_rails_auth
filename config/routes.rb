Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.htm
  root to: "home#index"

  devise_for :users, controllers: {
    sessions: 'users/sessions',
    registrations: 'users/registrations',
    passwords: 'users/passwords',
    unlocks: 'users/unlocks',
    confirmations: 'users/confirmations'
  }, defaults: {format: :json}

  devise_scope :user do
    get "users/current_user", to: "users/sessions#current"
    get "users/password/check", to: "users/passwords#check_token"
  end

  get '/member', to: 'members#show'

  get '*', to: 'home#index'
end
