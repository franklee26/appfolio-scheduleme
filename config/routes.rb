Rails.application.routes.draw do
  root 'homepage#index'
  get 'about' => 'about#index'
  get 'landowner' => 'landowners#index'
end
