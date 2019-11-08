Rails.application.routes.draw do
  get 'calendar/index'
  get 'tenants/new'

  root 'homepage#index'
  get 'about' => 'about#index'
  get 'auth' => 'calendar#auth'
  get 'calendar' => 'calendar#index'
  get 'calendar/auth' => 'calendar#auth'
  get 'calendar/callback' => 'calendar#callback'
end
