# == Schema Information
#
# Table name: child_illustrators
#
#  id              :integer          not null, primary key
#  name            :string(255)
#  age             :integer
#  illustration_id :integer
#  created_at      :datetime
#  updated_at      :datetime
#

class ChildIllustrator < ActiveRecord::Base
  belongs_to :illustration
end
