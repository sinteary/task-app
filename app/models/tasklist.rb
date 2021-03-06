class Tasklist < ApplicationRecord
  belongs_to :user
  has_many :tasks, dependent: :delete_all

  def as_json(options={})
    super(:except => [:created_at, :updated_at],
          :include => { 
            :tasks => { :include => {
              :tags => {}
            }}
          })
  end

end
