class TasklistsController < ApplicationController
  skip_before_action :verify_authenticity_token
  
  def index
    tasklist = Tasklist.all.order(created_at: :desc)
    render json: tasklist
  end

  def create
    tasklist.create(tasklist_params)
    if tasklist
      render json: tasklist
    else
      render json: tasklist.errors
    end
  end

  def edit
    
  end

  def show
    if task
      render json: tasklist
    else
      render json: tasklist.errors
    end
  end 
  
  def destroy
    tasklist = Tasklist.find(params[:id])
    tasklist.destroy
    head :no_content, status: :ok
  end

  private
  def tasklist_params
    params.permit(:name)
  end

  def tasklist
    @tasklist ||= tasklist.find(params[:id])
  end


end
