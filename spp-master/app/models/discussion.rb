class Discussion
	include ActiveModel::Model
	def self.create_topic(title,comment, user)
		client = get_client(user.username)
		client.create_topic(
			category: "Story",
			skip_validation: true,
			title: title,
			auto_track: false,
			raw: comment
		)
	end

  def self.create_user(user)
    get_client(User.find_by_email(Settings.discussion.admin_user).admin_username)
    .create_user(name: user.name,
                 email: user.email,
                 password: user.encrypted_password,
                 username: user.username,
                 active: true)
  end

  def self.generate_api_key
    get_client(Settings.discussion.system_user)
    .generate_master_key
  end

  def self.get_topic_with_last_20_posts_by_id(id)
    JSON.parse RestClient.get "#{Settings.discussion.url}/t/#{id}/20.json"
  end

  def self.create_post(topic_id, raw, user)
    get_client(user.username)
    .create_post(topic_id: topic_id,
                 raw: raw)
  end

  def self.topic_url(topic_slug)
    "#{Settings.discussion.url}/t/#{topic_slug}"
  end

  def self.latest_topics
    begin
      return get_readonly_client.latest_topics
    rescue Exception => e
      puts "Unable to get latest topics from Discourse. Error: #{e}"
    end
    []
  end

	private
	def self.get_client(username)
		client = DiscourseApi::Client.new(Settings.discussion.url)
		client.api_key = Settings.discussion.api_key
		client.api_username = username
		return client
	end

  def self.get_readonly_client
    get_client(User.find_by_email(Settings.discussion.read_only_user).username)
  end
end	
