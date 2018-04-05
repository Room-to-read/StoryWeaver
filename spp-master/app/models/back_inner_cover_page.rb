# == Schema Information
#
# Table name: pages
#
#  id                   :integer          not null, primary key
#  page_template_id     :integer
#  story_id             :integer
#  content              :text
#  crop_height          :float
#  crop_width           :float
#  position             :integer
#  created_at           :datetime
#  updated_at           :datetime
#  type                 :string(255)
#  illustration_crop_id :integer
#

class BackInnerCoverPage < Page
end
