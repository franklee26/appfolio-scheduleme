# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

# Tenant seeds
Tenant.create(id: 1, name: "John Lennon", email: "jlennon@gmail.com")
Tenant.create(id: 2, name: "Benedino Cucumberpatch", email: "bcucumberpatch@gmail.com")
Tenant.create(id: 3, name: "Steve Jobs", email: "sjobs@apple.com")

# Landowner seeds
Landowner.create(id: 1, name: "James Gelb", email: "IJustWantYourMoney@gimme.com")
