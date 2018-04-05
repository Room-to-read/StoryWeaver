# == Schema Information
#
# Table name: illustration_downloads
#
#  id              :integer          not null, primary key
#  user_id         :integer          not null
#  illustration_id :integer          not null
#  download_type   :string(255)
#  ip_address      :string(255)
#  created_at      :datetime
#  updated_at      :datetime
#

class IllustrationDownload < ActiveRecord::Base

  belongs_to :user
  belongs_to :illustration

  validate :user, presence: true
  validate :illustration, presence: true
end
