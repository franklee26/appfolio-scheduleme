Rails.application.routes.draw do
  resources :reviews
  get 'sessions/new'

  # tenants
  get 'tenants', to: 'tenants#index'
  get 'tenants/auth', to: 'tenants#auth'
  get 'tenants/profile' => 'tenants#profile'
  get 'tenants/no_landowner', to: 'tenants#no_landowner'
  get 'tenants/get_freebusy/:id', to: 'tenants#get_freebusy'
  patch 'tenants/update_tenant', to: 'tenants#update_tenant'

  # home page
  root 'homepage#index'

  # about page
  get 'about' => 'about#index'

  # calendar calls
  get 'calendar', to: 'calendar#index'
  get 'calendar/get_ids', to: 'calendar#get_ids'
  get 'calendar/login', to: 'calendar#user_selection'
  get 'calendar/callback', to: 'calendar#callback'
  get 'calendar/:calendar_id', to: 'calendar#events', calendar_id: /[^\/]+/
  get 'calendar/:calendar_id/response', to: 'calendar#get', calendar_id: /[^\/]+/
  post 'calendar/:calendar_id/:start/:end', to: 'calendar#post', calendar_id: /[^\/]+/, start: /[^\/]+/, end: /[^\/]+/
  get 'calendar/schedule/:landowner_id/:tenant_id', to: 'calendar#schedule'


  # landowner page
  get 'landowner' => 'landowners#index'
  get 'landowner/auth', to: 'landowners#auth'
  get 'landowner/profile', to: 'landowners#profile'
  get 'landowner/:landowner_id', to: 'landowners#show', landowner_id: /[^\/]+/
  post 'landowner/add_tenant', to: 'landowners#add_tenant'
  post 'landowner/add_vendor', to: 'landowners#add_vendor'
  delete 'landowner/tenants/:tenant_id', to: 'landowners#destroy_tenant', tenant_id: /[0-9]+/
  delete 'landowner/:landowner_id/vendors/:vendor_id', to: 'landowners#destroy_vendor', landowner_id: /[0-9]+/, vendor_id: /[0-9]+/
  patch 'landowner/update_landowner', to: 'landowners#update_landowner'

  # vendor pages
  get 'vendors' => 'vendors#index'
  get 'vendors/auth' => 'vendors#auth'
  get 'vendors/search' => 'vendors#search'
  get 'vendors/profile' => 'vendors#profile'
  get 'vendors/:id', to: 'vendors#show', id: /[0-9]+/
  patch 'vendors/update_vendor', to: 'vendors#update_vendor'

  # freebusy
  get 'freebusy/schedule/:landowner_id/:tenant_id', to: 'freebusies#schedule'

  # sessions
  get 'sessions/login', to: 'sessions#login'
  get 'sessions/logout', to: 'sessions#destroy'

  # jobs
  post 'jobs/complete', to: 'jobs#complete'
  post 'jobs/new_temp_job', to: 'jobs#new_temp_job'


  # resources
  resources :tenants
  resources :vendors
  resources :landowners
  resources :jobs
end
