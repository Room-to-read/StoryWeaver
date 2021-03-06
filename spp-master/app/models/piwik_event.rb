# == Schema Information
#
# Table name: piwik_events
#
#  id         :integer          not null, primary key
#  category   :string(255)      not null
#  action     :string(255)      not null
#  name       :string(255)
#  value      :integer
#  created_at :datetime
#  updated_at :datetime
#

class PiwikEvent < ActiveRecord::Base
  validates :category, presence: true
  validates :action, presence: true
end
