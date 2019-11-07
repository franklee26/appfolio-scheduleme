Rails.application.routes.draw do
  get 'tenants/new'
  get 'tenants/login'

  root 'homepage#index'
  get 'about' => 'about#index'
end
