class Message < ApplicationRecord
  belongs_to :user
  belongs_to :party

  validates :content, presence: true
end
