Rails.application.routes.draw do
  get 'sessions/new'

  # tenants
  get 'tenants', to: 'tenants#index'
  get 'tenants/login'
  get 'tenants/auth', to: 'tenants#auth'
  get 'tenants/profile' => 'tenants#profile'
  get 'tenants/no_landowner', to: 'tenants#no_landowner'

  # home page
  root 'homepage#index'

  # about page
  get 'about' => 'about#index'

  # calendar calls
  get 'calendar', to: 'calendar#index'
  get 'calendar/login', to: 'calendar#user_selection'
  get 'calendar/callback', to: 'calendar#callback'
  get 'calendar/:calendar_id', to: 'calendar#events', calendar_id: /[^\/]+/
  get 'calendar/:calendar_id/response', to: 'calendar#get', calendar_id: /[^\/]+/
  post 'calendar/:calendar_id/:start/:end', to: 'calendar#post', calendar_id: /[^\/]+/, start: /[^\/]+/, end: /[^\/]+/


  # landowner page
  get 'landowner' => 'landowners#index'
  get 'landowner/auth', to: 'landowners#auth'
  get 'landowner/profile', to: 'landowners#profile'
  get 'landowner/:landowner_id', to: 'landowners#show', landowner_id: /[^\/]+/
  post 'landowner/add_tenant', to: 'landowners#add_tenant'
  delete 'landowner/tenants/:tenant_id', to: 'landowners#destroy_tenant', tenant_id: /[^\/]+/

  # vendor pages
  get 'vendors/search' => 'vendor#search'
  get 'vendors' => 'vendor#index'
  get 'vendors/profile' => 'vendor#profile'
  get 'vendors/show' => 'vendor#show'

  # resources
  resources :tenants
  resources :vendor
  resources :landowners
  resources :jobs
end
