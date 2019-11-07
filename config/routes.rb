Rails.application.routes.draw do
  get 'calendar/index'

  root 'homepage#index'
  get 'about' => 'about#index'
  get 'auth' => 'calendar#auth'
  get 'calendar', to: 'calendar#index'
  get 'calendar/auth', to: 'calendar#auth'
  get 'calendar/callback', to: 'calendar#callback'
  get 'calendar/:calendar_id', to: 'calendar#events', calendar_id: /[^\/]+/
end
