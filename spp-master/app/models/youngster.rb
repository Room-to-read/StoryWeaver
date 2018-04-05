# == Schema Information
#
# Table name: youngsters
#
#  id         :integer          not null, primary key
#  name       :string(255)
#  age        :integer
#  story_id   :integer
#  created_at :datetime
#  updated_at :datetime
#

class Youngster < ActiveRecord::Base
  belongs_to :story

end
