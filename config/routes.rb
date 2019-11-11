Rails.application.routes.draw do
  root 'homepage#index'
  get 'about' => 'about#index'
  get 'vendors/profile' => 'vendor#profile'
  get 'vendors/search' => 'vendor#search'
  get 'vendors/results' => 'vendor#results'

end
