module Peoplesearch
  class Users
    attr_reader :params, :current_user, :user_signed_in
    EVERYTHING = "*"
    PER_PAGE = 10
    DEFAULT_CRITERIA = [
        { _score: {order: :desc} },
        { views: {order: :desc} },
        { likes: {order: :desc} }
    ]

    def initialize(params, current_user, user_signed_in)
      @params = params
      @current_user = current_user
      @user_signed_in = user_signed_in
    end

    def sanitize_search_results_for_api_search(result)
      sanitized_response = {}
      sanitized_response["id"] = result["id"]
      sanitized_response["name"] = result["name"]
      sanitized_response["slug"] = result["slug"]
      sanitized_response["type"] = result["type"]
      sanitized_response["profileImage"] = result["profile_image"]
      sanitized_response
    end

    def search_params
      if @params[:search].blank?
        {query: nil, status: [], languages: [], categories: [], reading_levels: [], author_id: nil, organization_id: nil}
      else
        search_params = @params.require(:search).permit(:query, :cache, :author_id, :organization_id, :min_story_count, status: [], languages: [], categories: [],reading_levels: [],
                                                        sort:[{views: :order}, {likes: :order},{published_at: :order },
                                                              {created_at: :order}]
        )
        search_params
      end
    end

    def filters(search_params)
      filters = {}
      return filters
    end

    def search
      filters = filters(search_params)
      order_criteria = User.count > 0 ? search_params[:sort] || DEFAULT_CRITERIA : []
      query = search_query(filters, order_criteria, offset = nil)
      @results = query
      {
          query: search_params,
          order: order_criteria,
          search_results: @results.map { |result| sanitize_search_results_for_api(result) },
          metadata:
              {
                  hits:         @results.total_count,
                  perPage:     @results.per_page,
                  page:         @results.current_page,
                  totalPages:  @results.total_pages
              }
      }
    end

    def general_search
      filters = filters(search_params)
      order_criteria = List.count > 0 ? search_params[:sort] || DEFAULT_CRITERIA : []
      query = search_query(filters, order_criteria, offset = nil)
      @results = query
      {
          query: search_params,
          order: order_criteria,
          search_results: @results.map { |result| sanitize_search_results_for_api_search(result) },
          metadata:
              {
                  hits:         @results.total_count,
                  perPage:     @results.per_page,
                  page:         @results.current_page,
                  totalPages:  @results.total_pages
              }
      }
    end

    def search_query(filters, order_criteria, offset = nil)
      random_score = {function_score:{ random_score: { seed: DateTime.now.strftime("%Y%m%d").to_i } }}
      query = User.search(
          search_params[:query].blank? ? EVERYTHING : search_params[:query],
          page: @params[:page],
          per_page: @params[:per_page] || PER_PAGE,
          operator: "or",
          fields:['title^20', 'description^15', "languages", "reading_levels"],
          where: filters,
          order: order_criteria,
          load: false,
          execute: false)
      query.execute
    end


    def update_cache(key,page)
      results = search
      cache_key = "#{key}_#{page}"
      Rails.cache.write(cache_key, results, :expires_in => 5.minutes)
      read_cache(key,page)
    end

    def read_cache(key,page)
      cache_key = "#{key}_#{page}"
      Rails.cache.fetch(cache_key)
    end

    def get_cache(key,page)
      read_cache(key,page) || update_cache(key,page)
    end

  end
end
