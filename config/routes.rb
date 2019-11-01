Rails.application.routes.draw do

  get 'tenant/new'

  get 'tenant_controller/new'

  get 'controllername/new'

  get 'controllername/create'

  root 'homepage#index'
  get 'about' => 'about#index'
  get 'tenant' =>'tenant#index'
  get 'signup' => 'tenant#new'

end
