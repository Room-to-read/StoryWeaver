# == Schema Information
#
# Table name: language_fonts
#
#  id         :integer          not null, primary key
#  font       :string(255)
#  script     :string(255)
#  created_at :datetime
#  updated_at :datetime
#

class LanguageFont < ActiveRecord::Base

	validates :script, presence: true
	validates :font, presence: true

	has_many :languages
end
