# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

Tenant.create(id: 1, name: "John Lennon")
Tenant.create(id: 2, name: "Benedino Cucumberpatch")
Tenant.create(id: 3, name: "Steve Jobs")

Vendor.create(id: 10, name: "Bob Electrician", occupation: "Electrician")
Vendor.create(id: 11, name: "Bob Plumber", occupation: "Plumber")