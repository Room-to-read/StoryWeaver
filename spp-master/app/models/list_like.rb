# == Schema Information
#
# Table name: list_likes
#
#  id         :integer          not null, primary key
#  user_id    :integer
#  list_id    :integer
#  created_at :datetime
#  updated_at :datetime
#

class ListLike < ActiveRecord::Base
  belongs_to :user
  belongs_to :list
end
