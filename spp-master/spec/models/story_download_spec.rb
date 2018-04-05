# == Schema Information
#
# Table name: story_downloads
#
#  id                :integer          not null, primary key
#  user_id           :integer          not null
#  story_id          :integer          not null
#  download_type     :string(255)
#  ip_address        :string(255)
#  created_at        :datetime
#  updated_at        :datetime
#  organization_user :boolean          default(FALSE)
#  org_id            :integer
#

require 'rails_helper'

RSpec.describe StoryDownload, :type => :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
