Rails.application.routes.draw do
  # tenants
  get 'tenants/login'
  get 'tenants/auth', to: 'tenants#auth'

  # home page
  root 'homepage#index'

  # about page
  get 'about' => 'about#index'

  # calendar calls
  get 'calendar', to: 'calendar#index'
  get 'calendar/login', to: 'calendar#user_selection'
  get 'calendar/callback', to: 'calendar#callback'
  get 'calendar/:calendar_id', to: 'calendar#events', calendar_id: /[^\/]+/


  # landowner page
  get 'landowner' => 'landowners#index'
  get 'landowner/auth', to: 'landowners#auth'

  # vendor pages
  get 'vendors/profile' => 'vendor#profile'
  get 'vendors' => 'vendor#index'
  get 'vendors/show' => 'vendor#show'

  # resources
  resources :tenants
end
