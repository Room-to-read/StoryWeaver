namespace :discussion do
  desc "Generate API key"
  task :generate_api_key  => :environment do
    # response = Discussion.generate_api_key
    # puts "API key, #{response['api_key']['key']} generated on Discourse."
  end

  desc "Create user"
  task :create_user  => :environment do
    raise "ERROR: Missing user email!\ne.g: rake create_user EMAIL=user@storyweaver.org.in\n" if (email = ENV['EMAIL']).blank?
    user = User.find_by_email(email)
    raise "ERROR: Cannot find user with given email #{email}, please provide an email that is registered in StoryWeaver db." if user.nil?
    # Discussion.create_user(user)
    puts "User created on Discourse."
  end

  desc "Create discourse accounts for existing users on StoryWeaver."
  task :migrate_current_users  => :environment do
    User.all.each do |user|
      # response = Discussion.create_user(user)
      puts "Account created successfully on discourse for user '#{user.email}'. Discourse user id: #{response['user_id']}" if response['success']
      puts "Account could not be created for '#{user.email}'. Error JSON: #{response['errors'].to_s}" unless response['success']
    end
  end

  desc "Create discourse topics for all published stories on StoryWeaver."
  task :create_topic_for_published_stories  => :environment do
    Story.where(status: Story.statuses[:published], topic_id: nil).
      each do |story|
        # Discussion.create_user(story.authors.first) rescue true
        # story.create_discussion_topic_if_does_not_exist
      end
  end
end

