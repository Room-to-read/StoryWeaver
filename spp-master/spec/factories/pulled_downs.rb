# == Schema Information
#
# Table name: pulled_downs
#
#  id               :integer          not null, primary key
#  pulled_down_type :string(255)
#  pulled_down_id   :integer
#  reason           :string(255)
#  created_at       :datetime
#  updated_at       :datetime
#

FactoryGirl.define do
  factory :pulled_down do
    
  end

end
