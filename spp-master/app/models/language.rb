# == Schema Information
#
# Table name: languages
#
#  id                :integer          not null, primary key
#  name              :string(32)       not null
#  is_right_to_left  :boolean          default(FALSE)
#  can_transliterate :boolean          default(FALSE)
#  created_at        :datetime
#  updated_at        :datetime
#  script            :string(255)
#  locale            :string(255)
#  bilingual         :boolean          default(FALSE)
#  language_font_id  :integer
#  level_band        :string(255)
#  translated_name   :string(255)
#
# Indexes
#
#  index_languages_on_name  (name)
#

class Language < ActiveRecord::Base

  validates :name, presence: true, uniqueness: { case_sensitive: false }, length: { maximum: 32 }
  validates :translated_name, presence: true, uniqueness: { case_sensitive: false }, length: { maximum: 32 }
  validates :script, presence: true 

  has_and_belongs_to_many :contests
  has_many :reviewers_languages
  has_many :reviewers, through: :reviewers_languages, source: :user
  has_and_belongs_to_many :translators, class_name: 'User', join_table: 'translators_languages'
  belongs_to :language_font
  has_many :stories
  scope :published_languages, -> {joins(:stories).where('stories.status' => 1).uniq.order(:name)}
  default_scope {order("name ASC") }

  translates :name, :translated_name
  
  def get_name
  	bilingual == true ? name+(" (bilingual)") : name
  end
end
