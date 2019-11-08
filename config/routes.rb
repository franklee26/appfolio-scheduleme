Rails.application.routes.draw do
  get 'calendar/index'
  get 'tenants/login'

  root 'homepage#index'
  get 'about' => 'about#index'
  get 'auth' => 'calendar#auth'
  get 'calendar' => 'calendar#index'
  get 'calendar/auth' => 'calendar#auth'
  get 'calendar/callback' => 'calendar#callback'

  resources :tenants
end
