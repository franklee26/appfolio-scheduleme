class JobsController < ApplicationController
  before_action :set_job, only: [:show, :edit, :update, :destroy]
  protect_from_forgery :except => [:new_temp_job]

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
    job.created_at = body["created_at"]
    job.updated_at = body["updated_at"]
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

  # GET /jobs/1
  # GET /jobs/1.json
  def show
  end

  # GET /jobs/new
  def new
    @job = Job.new
  end

  # GET /jobs/1/edit
  def edit
  end

  # POST /jobs
  # POST /jobs.json
  def create
    @job = Job.new(job_params)
    @job.vendor_id = 0
    @job.tenant_id = session[:tenant_id]
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
      params.require(:job).permit(:content, :tenant_id, :vendor_id)
    end
end
