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

require 'rails_helper'

RSpec.describe ChildIllustrator, :type => :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
