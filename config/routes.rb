Rails.application.routes.draw do
  get 'calendar/index'
  get 'tenants/login'

  # home page
  root 'homepage#index'

  # about page
  get 'about' => 'about#index'

  # authentication page calls google oauth
  get 'auth' => 'calendar#auth'

  # calendar calls
  get 'calendar', to: 'calendar#index'
  get 'calendar/auth', to: 'calendar#auth'
  get 'calendar/callback', to: 'calendar#callback'
  get 'calendar/:calendar_id', to: 'calendar#events', calendar_id: /[^\/]+/

  # landowner page
  get 'landowner' => 'landowners#index'

  # vendor pages
  get 'vendors/profile' => 'vendor#profile'
  get 'vendors/search' => 'vendor#search'
  get 'vendors/results' => 'vendor#results'

  # resources
  resources :tenants
end
