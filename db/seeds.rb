# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

one = Tenant.create(id: 1, name: "John Lennon", email: "jlennon@gmail.com")
two = Tenant.create(id: 2, name: "Benedino Cucumberpatch", email: "bcucumberpatch@gmail.com")
three = Tenant.create(id: 3, name: "Steve Jobs", email: "sjobs@apple.com")

#Job.create(id:1, content:"zoom1",Tenant_id: one.id)
#Job.create(id:2, content:"zoom2",Tenant_id: one.id)
#Job.create(id:3, content:"zoom3",Tenant_id: two.id)
