Rails.application.routes.draw do
  root 'homepage#index'
  get 'about' => 'about#index'
end
