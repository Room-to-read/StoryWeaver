# == Schema Information
#
# Table name: illustration_categories
#
#  id         :integer          not null, primary key
#  name       :string(32)       not null
#  created_at :datetime
#  updated_at :datetime
#
# Indexes
#
#  index_illustration_categories_on_name  (name)
#

class IllustrationCategory < ActiveRecord::Base
  validates :name, presence: true, uniqueness: { case_sensitive: false }, length: { maximum: 32 }

  default_scope {order("name ASC") }
  has_and_belongs_to_many :illustrations

  after_commit :reindex_illustrations
 
  translates :name, :translated_name

  def reindex_illustrations
    illustrations.each{|illustration| illustration.reindex}
  end
end
