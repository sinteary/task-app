class Tag < ApplicationRecord
  validates :name, presence: true
  has_many :labels
  has_many :tasks, through: :labels

  
end
