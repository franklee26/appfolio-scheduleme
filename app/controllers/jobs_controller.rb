class JobsController < ApplicationController
  before_action :set_job, only: [:show, :edit, :update, :destroy]
  protect_from_forgery :except => [:new_temp_job, :complete]

  # GET /jobs
  # GET /jobs.json
  def index
    @jobs = Job.all
    render json: @jobs
  end

  def new_temp_job

    body = JSON(request.body.read)
    job = Job.new
    job.content = body["content"]
    job.title = body["title"]
    job.job_type = body["job_type"]
    job.status = body["status"]
    job.tenant_id = body["tenant_id"]
    job.vendor_id = body["vendor_id"]
    job.start = body["start"]
    job.end = body["end"]

    job.save!
    render json: body
  end

  def finish
    job_id = params[:job_id]

    job = Job.find(job_id)
    job.status = "VENDOR COMPLETE"
    job.save!

    render json: {status: 200}
  end

  def complete
    body = JSON(request.body.read)

    # Get job
    job_id = body["job_id"]
    job = Job.find(job_id)
    job_content = job.content
    job_tenant_id = job.tenant_id

    # first make this job done!
    job.status = "COMPLETE"
    job.save!
    
    # now delete all the jobs
    to_delete_ids = Job.all.select{ 
      |j| (j.status == "LANDOWNER APPROVED" || 
        j.status == "PROCESSING") && 
        j.content == job_content && 
        j.tenant_id == job_tenant_id 
    }.map { 
      |j| j.id 
    }
    to_delete_ids.each do |id|
      Job.delete(id)
    end
  end

  # GET /jobs/1
  # GET /jobs/1.json
  def show
  end

  # GET /jobs/new
  def new
    @tenant_id = session[:tenant_id]
    @landowner_id = Tenant.find(@tenant_id).landowner_id
    @job = Job.new
    @num_jobs = Tenant.find(@tenant_id).jobs.length
  end

  # GET /jobs/1/edit
  def edit
  end

  # POST /jobs
  # POST /jobs.json
  def create
    # essentially just a check now
    @job = Job.new(job_params)
    @job.vendor_id = 0
    @job.tenant_id = session[:tenant_id]
    @job.status = "PROCESSING"
    respond_to do |format|
      if @job.save
        format.html { redirect_to @job, notice: 'Job was successfully created.' }
        format.json { render :show, status: :created, location: @job }
      else
        format.html { render :new }
        format.json { render json: @job.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /jobs/1
  # PATCH/PUT /jobs/1.json
  def update
    respond_to do |format|
      if @job.update(job_params)
        format.html { redirect_to @job, notice: 'Job was successfully updated.' }
        format.json { render :show, status: :ok, location: @job }
      else
        format.html { render :edit }
        format.json { render json: @job.errors, status: :unprocessable_entity }
      end
    end
  end


  
  # DELETE /jobs/1
  # DELETE /jobs/1.json
  def destroy
    @job.destroy
    respond_to do |format|
      format.html { redirect_to jobs_url, notice: 'Job was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_job
      @job = Job.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def job_params
      params.require(:job).permit(:content, :tenant_id, :vendor_id, :title, :job_type)
    end
end
