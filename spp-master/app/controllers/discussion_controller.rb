class DiscussionController < ApplicationController

  def sso
    session[:previous_url] = request.fullpath
    authenticate_user!
    sso = Discussion::SingleSignOn.parse(request.query_string, Settings.discussion.secret)
    sso.email = current_user.email # from devise
    sso.name = current_user.name # this is a custom method on the User class
    sso.username = current_user.username # from devise
    sso.external_id = current_user.id # from devise
    sso.sso_secret = Settings.discussion.secret

    redirect_to sso.to_url("#{Settings.discussion.url}/session/sso_login")
  end
end
