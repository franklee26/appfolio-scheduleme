Rails.application.routes.draw do
  get 'users/new'

  root 'homepage#index'
  get 'about' => 'about#index'
end
