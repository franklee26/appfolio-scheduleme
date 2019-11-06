Rails.application.routes.draw do
  get 'tenants/new'

  root 'homepage#index'
  get 'about' => 'about#index'
end
