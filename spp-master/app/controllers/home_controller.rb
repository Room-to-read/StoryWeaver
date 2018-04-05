class HomeController < ApplicationController
  layout "home"
  def index
    @search_params = {}
    @create_new_story = false
    if(request.path == '/start')
      @create_new_story = true
      @contest_id = params[:contest_id]
    end
    @number_of_stories = Story.where(status: Story.statuses[:published]).count
    @number_of_reads = Story.sum(:reads)
    language_ids = Story.where(status: Story.statuses[:published]).collect(&:language_id).uniq
    @number_of_languages = Language.where(:id => language_ids).collect(&:name).map{|n| n.split("-")}.flatten.uniq.size
    respond_to do |format|
      format.html {}
      format.json do
        render json: {
          links: [
            {
              rel: 'search',
              uri: '/search'
            },
            {
              rel: 'new-arrivals',
              uri: '/search?search[sort][][created_at][order]=desc'
            },
            {
              rel: 'most-reads',
              uri: '/search?search[sort][][reads][order]=desc'
            },
            {
              rel: 'most-liked',
              uri: '/search?search[sort][][likes][order]=desc'
            },
            {
              rel: 'recommended',
              uri: '/search?search[recommended]=true'
            }
          ]
        }
      end
    end
  end

  def robots                                                                                                                                      
    robots = File.read(Rails.root + "config/robots.#{Rails.env}.txt")
    render :text => robots, :layout => false, :content_type => "text/plain"
  end

end
