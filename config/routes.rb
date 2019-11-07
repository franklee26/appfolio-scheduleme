Rails.application.routes.draw do
<<<<<<< HEAD
  get 'calendar/index'
=======
  get 'tenants/new'
<<<<<<< HEAD
>>>>>>> added email to tenant, and validation tests
=======
  get 'tenants/login'
>>>>>>> added login view and login JS component for tenants

  root 'homepage#index'
  get 'about' => 'about#index'
  get 'auth' => 'calendar#auth'
  get 'calendar' => 'calendar#index'
  get 'calendar/auth' => 'calendar#auth'
  get 'calendar/callback' => 'calendar#callback'
end
