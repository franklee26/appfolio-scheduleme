# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

# Landowner seeds
# THIS LANDOWNER IS SUPER IMPORTANT! THIS IS THE DEFAULT LANDOWNER SO DO NOT DELETE THIS. MAKE SURE YOU SEED THIS DATA FIRST.
Landowner.create(id: 0, name: "DEFAULT", email: "DEFAULT@DEFAULT.DEFAULT")
Landowner.create(id: 1, name: "Tech Lead", email: "thetechlead@techlead.the")

# Tenant seeds
t_one = Tenant.create(id: 1, name: "John Lennon", email: "jlennon@gmail.com", landowner_id: 0, street_address: "123 seasame street", city: "Goleta", state: "CA", zip: "12345")
t_two = Tenant.create(id: 2, name: "Benedino Cucumberpatch", email: "bcucumberpatch@gmail.com", landowner_id: 0, street_address: "123 seasame street", city: "Goleta", state: "CA", zip: "12345")
t_three = Tenant.create(id: 3, name: "Steve Jobs", email: "sjobs@apple.com", landowner_id: 0, street_address: "123 seasame street", city: "Goleta", state: "CA", zip: "12345")

v_one = Vendor.create(id: 10, name: "Bob Electrician", occupation: "Electrician", email: "electrician@gmail.com")
v_two = Vendor.create(id: 11, name: "Bob Plumber", occupation: "Plumber", email: "plumber@gmail.com")
# one = Tenant.create(id: 1, name: "John Lennon", email: "jlennon@gmail.com")
# two = Tenant.create(id: 2, name: "Benedino Cucumberpatch", email: "bcucumberpatch@gmail.com")
# three = Tenant.create(id: 3, name: "Steve Jobs", email: "sjobs@apple.com")
Job.create(id:1, content:"zoom1",Tenant_id: t_one.id, Vendor_id: v_one.id, title: 'job1', job_type: 'electrician', status: 'pending')
Job.create(id:2, content:"zoom2",Tenant_id: t_one.id, Vendor_id: v_two.id, title: 'job2', job_type: 'electrician', status: 'pending')
Job.create(id:3, content:"zoom3",Tenant_id: t_two.id, Vendor_id: v_one.id, title: 'job3', job_type: 'electrician', status: 'pending')
Job.create(id:4, content:"zoom4",Tenant_id: t_one.id, Vendor_id: v_one.id, title: 'job4', job_type: 'electrician', status: 'pending')
Job.create(id:5, content:"zoom5",Tenant_id: t_one.id, Vendor_id: v_two.id, title: 'job5', job_type: 'electrician', status: 'pending')
Job.create(id:6, content:"zoom6",Tenant_id: t_one.id, Vendor_id: v_one.id, title: 'job6', job_type: 'electrician', status: 'pending')
Job.create(id:7, content:"zoom7",Tenant_id: t_one.id, Vendor_id: v_two.id, title: 'job7', job_type: 'electrician', status: 'pending')
Job.create(id:8, content:"zoom8",Tenant_id: t_one.id, Vendor_id: v_one.id, title: 'job8', job_type: 'electrician', status: 'pending')
Job.create(id:9, content:"zoom9",Tenant_id: t_one.id, Vendor_id: v_two.id, title: 'job9', job_type: 'electrician', status: 'pending')
Job.create(id:10, content:"zoom10",Tenant_id: t_one.id, Vendor_id: v_one.id, title: 'job10', job_type: 'electrician', status: 'pending')
Job.create(id:11, content:"zoom11",Tenant_id: t_one.id, Vendor_id: v_two.id, title: 'job11', job_type: 'electrician', status: 'pending')
Job.create(id:12, content:"zoom12",Tenant_id: t_one.id, Vendor_id: v_one.id, title: 'job12', job_type: 'electrician', status: 'pending')
Job.create(id:13, content:"zoom13",Tenant_id: t_one.id, Vendor_id: v_two.id, title: 'job13', job_type: 'electrician', status: 'completed')
