# == Schema Information
#
# Table name: list_views
#
#  id         :integer          not null, primary key
#  user_id    :integer
#  list_id    :integer
#  created_at :datetime
#  updated_at :datetime
#

class ListView < ActiveRecord::Base
  belongs_to :user
  belongs_to :list
  after_save :reindex_list

  def reindex_list
    self.list.reindex
  end
end
