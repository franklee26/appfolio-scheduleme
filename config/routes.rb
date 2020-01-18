Rails.application.routes.draw do
  get 'sessions/new'

  # tenants
  get 'tenants', to: 'tenants#index'
  get 'tenants/login'
  get 'tenants/auth', to: 'tenants#auth'
  get 'tenants/profile' => 'tenants#profile'

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
  get 'landowner/:landowner_id', to: 'landowners#get', landowner_id: /[^\/]+/
  post 'landowner/add_tenant', to: 'landowners#add_tenant'
  get 'landowner/tenants/:landowner_id', to: 'landowners#tenants', landowner_id: /[^\/]+/

  # vendor pages
  get 'vendors/search' => 'vendor#search'
  get 'vendors' => 'vendor#index'
  get 'vendors/show' => 'vendor#show'

  # resources
  resources :tenants
  resources :jobs
end
