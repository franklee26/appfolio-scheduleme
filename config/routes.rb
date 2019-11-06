Rails.application.routes.draw do
<<<<<<< HEAD
  get 'calendar/index'
=======
  get 'tenants/new'
>>>>>>> added email to tenant, and validation tests

  root 'homepage#index'
  get 'about' => 'about#index'
  get 'auth' => 'calendar#auth'
  get 'calendar' => 'calendar#index'
  get 'calendar/auth' => 'calendar#auth'
  get 'calendar/callback' => 'calendar#callback'
end
