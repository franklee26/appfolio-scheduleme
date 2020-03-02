# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20200302045401) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "jobs", force: :cascade do |t|
    t.text "content"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "title"
    t.string "job_type"
    t.string "status"
    t.bigint "tenant_id"
    t.bigint "vendor_id"
    t.datetime "start"
    t.datetime "end"
    t.boolean "reviewed"
    t.index ["tenant_id"], name: "index_jobs_on_tenant_id"
    t.index ["vendor_id"], name: "index_jobs_on_vendor_id"
  end

  create_table "landowners", force: :cascade do |t|
    t.string "name"
    t.string "email"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "auth_token"
    t.string "refresh_token"
    t.string "phone_number"
  end

  create_table "landowners_vendors", id: false, force: :cascade do |t|
    t.bigint "landowner_id", null: false
    t.bigint "vendor_id", null: false
    t.index ["landowner_id", "vendor_id"], name: "index_landowners_vendors_on_landowner_id_and_vendor_id"
    t.index ["vendor_id", "landowner_id"], name: "index_landowners_vendors_on_vendor_id_and_landowner_id"
  end

  create_table "reviews", force: :cascade do |t|
    t.bigint "job_id"
    t.string "text"
    t.float "rating"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["job_id"], name: "index_reviews_on_job_id"
  end

  create_table "tenants", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "email"
    t.bigint "landowner_id"
    t.string "street_address"
    t.string "city"
    t.string "state"
    t.string "zip"
    t.string "auth_token"
    t.string "refresh_token"
    t.string "phone_number"
    t.string "avatar_file_name"
    t.string "avatar_content_type"
    t.integer "avatar_file_size"
    t.datetime "avatar_updated_at"
    t.index ["landowner_id"], name: "index_tenants_on_landowner_id"
  end

  create_table "vendors", force: :cascade do |t|
    t.string "name"
    t.string "occupation"
    t.string "email"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "zip"
    t.string "auth_token"
    t.string "refresh_token"
    t.string "phone_number"
    t.string "calendar_id"
    t.integer "num"
    t.float "rating"
  end

  add_foreign_key "jobs", "tenants"
  add_foreign_key "jobs", "vendors"
  add_foreign_key "reviews", "jobs"
  add_foreign_key "tenants", "landowners"
end
