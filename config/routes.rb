Rails.application.routes.draw do
  root 'homepage#index'
  get 'about' => 'about#index'
  get 'vendors' => 'vendor#index'
end
