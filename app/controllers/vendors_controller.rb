class VendorsController < ApplicationController
  protect_from_forgery :except => [:update_vendor]

  def index
    @vendor = Vendor.all.sort { |t1, t2| t1.id <=> t2.id }
    response = []
    @vendor.each do |v|
      vendor_obj = {
        "id": v.id,
        "name": v.name,
        "occupation": v.occupation,
        "email": v.email,
        "created_at": v.created_at,
        "updated_at": v.updated_at,
        "landowners": v.landowners,
        "rating": v.rating ? v.rating : 0.0
      }
      response << vendor_obj
    end
    render json: response, status: :ok
  end

  # PATCH /vendors/update_vendor  
  # expects json in the form:
=begin
  {
    "name": "name",
    "email": "email",
    "vendor_id": 10,
    "occupation": "test",
    "zip": "12334"
  }
=end
def update_vendor
  body = JSON(request.body.read)
  name = body["name"]
  email = body["email"]
  vendor_id = body["vendor_id"]
  occupation = body["occupation"]
  zip = body["zip"]
  response = {}
  @vendor = Vendor.find_by(id: vendor_id)
  if Vendor.find_by(id: vendor_id) && name.class == String && email.class == String && occupation.class == String && zip.class == String 
    @vendor.update_attribute(:name, name)
    @vendor.update_attribute(:email, email)
    @vendor.update_attribute(:occupation, occupation)
    @vendor.update_attribute(:zip, zip)
    response = {
      code: 200,
      name: name,
      email: email,
      zip: zip,
      occupation: occupation,
      vendor_id: vendor_id
    }
  else
    response = {
      code: 400,
      vendor_id: vendor_id
    }
  end
  render json: response, status: :ok
end


def update_rating
  body = JSON(request.body.read)
  rating = body["rating"]
  vendor_id = body["vendor_id"]
  job_id = body["job_id"]
  job = Job.find(job_id)
  job.reviewed = true
  job.save!
  vendor = Vendor.find_by(id: vendor_id)
  if vendor 
    if vendor.rating
      r = (vendor.rating).to_f * (vendor.num).to_f * 1.0 + (rating).to_f * 1.0
      n = vendor.num + 1
      rate = r/n
      vendor.update_attribute(:rating, rate)
      vendor.update_attribute(:num, n)
    else  
      vendor.update_attribute(:rating, rating )
      vendor.update_attribute(:num, 1)
    end
    render json: {status: 200}
  else
    render json: {status: 400}
  end
end

  # GET /vendor/1
  # Returns a json containing all the fields for the vendor
  def show
    vendor = Vendor.find(params[:id])
    vendor_jobs = []

    vendor.jobs.each do |j|
      job_obj = {
        id: j.id,
        content: j.content,
        created_at: j.created_at,
        updated_at: j.updated_at,
        title: j.title,
        job_type: j.job_type,
        status: j.status,
        tenant_id: j.tenant_id,
        vendor_id: j.vendor_id,
        start: j.start,
        end: j.end,
        tenant_name: j.tenant.name,
        address: j.tenant.street_address
      }
      vendor_jobs << job_obj
    end

    response = {
      "id": vendor.id,
      "name": vendor.name,
      "occupation": vendor.occupation,
      "email": vendor.email,
      "created_at": vendor.created_at,
      "updated_at": vendor.updated_at,
      "landowners": vendor.landowners,
      "jobs": vendor_jobs,
      "zip": vendor.zip
    }
    render json: response, status: :ok
  end

  # this is for displaying the vendor from search: this is NOT the vendor profile page...
  def display
    @vendor = Vendor.find(params[:id])

    # now find all of the vendor's reviews
    reviewed_job_ids = @vendor.jobs.filter { |j| j.reviewed }.map { |j| j.id}
    @reviews = Review.all.filter { |r| reviewed_job_ids.include? r.job_id }

    # for mapping review to tenant name (no direct association for this yet)
    @review_to_tenant = @reviews.to_h { |r| [r.id, Job.find(r.job_id).tenant.name] }
  end

  def search
    @vendor = Vendor.all.sort { |t1, t2| t1.id <=> t2.id }
  end

  def auth
    client = Signet::OAuth2::Client.new(clientOptions)
    session[:user_type] = "vendor"
    redirect_to client.authorization_uri.to_s
  end
	
end
