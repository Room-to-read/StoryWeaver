# == Schema Information
#
# Table name: page_templates
#
#  id                :integer          not null, primary key
#  name              :string(255)
#  orientation       :string(255)
#  image_position    :string(255)
#  content_position  :string(255)
#  image_dimension   :float
#  content_dimension :float
#  created_at        :datetime
#  updated_at        :datetime
#  type              :string(255)
#  default           :boolean          default(FALSE)
#

class PageTemplate < ActiveRecord::Base
  scope :default, -> { where(default: true) }
  scope :of_orientation, ->(orientation) { where("orientation = ?", orientation) }

  def get_similar_templates
    case self.class.to_s
    when "StoryPageTemplate"
      StoryPageTemplate.all
    when "FrontCoverPageTemplate"
      FrontCoverPageTemplate.all
    when "BackInnerCoverPageTemplate"
      BackInnerCoverPageTemplate.all
    when "BackCoverPageTemplate"
      BackCoverPageTemplate.all
    when "DedicationPageTemplate"
      DedicationPageTemplate.all
    end
  end

  def scaled_dimension_for_size(size)
    !(image_position == "left" || image_position == "right") ?
      size :
      size * image_dimension/100.0
  end

  def image_mandatory?
    !image_position.nil? && image_position != 'nil'
  end

  # max illustrartor character limit on front cover page
  def max_limit
    if image_dimension > 50
      orientation == "landscape" ? 150 : 100 
    else
      orientation == "landscape" ? 350 : 250
    end
  end

  def is_full_text_template?
    name == "sp_v_c100" || name == "sp_h_c100"
  end

end
