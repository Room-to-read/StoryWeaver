# == Schema Information
#
# Table name: illustration_styles
#
#  id         :integer          not null, primary key
#  name       :string(32)       not null
#  created_at :datetime
#  updated_at :datetime
#

class IllustrationStyle < ActiveRecord::Base
  validates :name, presence: true, uniqueness: true, length: {maximum: 32}
  default_scope {order("name ASC") }
  
  has_and_belongs_to_many :illustrations

  after_commit :reindex_illustrations
  
  translates :name, :translated_name

  def reindex_illustrations
    illustrations.each{|illustration| illustration.reindex}
  end
end
