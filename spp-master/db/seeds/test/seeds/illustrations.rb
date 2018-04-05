def create_illustrations(illustrations)
  (1..illustrations).each do|illustration|
    illustrator_user = User.find_by_email('user@sample.com')
    ill_person = Person.create!(user_id: illustrator_user.id, first_name: illustrator_user.first_name, last_name: illustrator_user.last_name)
    ill_person.save
    uploader = User.find_by_email('content_manager@sample.com')
    illustration_style = get_illustration_style
    illustration_category = get_illustration_category
    image_path = File.open(Rails.root.to_s + "/illustrations/image_#{illustration}.jpg")
    illustration = Illustration.create!(name: "testing_illustration_#{illustration}",
      styles: [illustration_style], categories: [illustration_category],
      illustrators: [ill_person], uploader_id: uploader.id, license_type: 'CC BY 4.0',
      image: image_path, attribution_text: 'sample automation text')
    illustration.save!
  end
  Illustration.reindex
end

def get_illustration_category
  illustration_category_id = rand(IllustrationCategory.count)+1
  rand_record = IllustrationCategory.find_by_id(illustration_category_id)
  return rand_record
end

def get_illustration_style
  illustration_style_id = rand(IllustrationStyle.count)+1
  rand_record = IllustrationStyle.find_by_id(illustration_style_id)
  return rand_record
end

create_illustrations(5)
