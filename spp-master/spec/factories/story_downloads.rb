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

FactoryGirl.define do
  factory :story_download do
    user
    download_type "low"
    ip_address "127.0.0.1"
    organization_user true
  end
end
