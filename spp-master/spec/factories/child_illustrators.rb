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

FactoryGirl.define do
  factory :child_illustrator do
    
  end

end
