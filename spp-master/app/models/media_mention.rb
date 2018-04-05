# == Schema Information
#
# Table name: media_mentions
#
#  id              :integer          not null, primary key
#  blog_post_id    :integer
#  user_id         :integer
#  created_at      :datetime
#  updated_at      :datetime
#  organization_id :integer
#

class MediaMention < ActiveRecord::Base
	belongs_to :user
	belongs_to :blog_post
	belongs_to :organization

	validates :blog_post, presence: true
end
