Feature: Login to storyweaver page

@javascript
Scenario: Login to storyweaver page - validate all the links in user Dashboard
  When I login as "user@sample.com" with "password"
  When I click at "Common Man"
  When I click link "Dashboard"

  Then I should see "My Details"
  Then I should see "My Published Stories"
  Then I should see "Published Stories Under Edit"
  Then I should see "My Illustrations"
  Then I should see "My Drafts"
  Then I should see "De-activated Stories"
  Then I should see "My Submitted Stories"

  When I click link "My Details"
  Then I should see "Want to change the way your name appears on StoryWeaver?"

  When I click link "My Published Stories"
  Then I should see "Story Title"
  Then I should see "Number of Reads"
  Then I should see "Derivatives"

  When I click link "Published Stories Under Edit"
  Then I should see "Story Title"
  Then I should see "Parent Story"
  Then I should see "Last updated on"

  When I click link "My Illustrations"
  Then I should see "Illustration"
  Then I should see "Title"
  Then I should see "No of stories used in"

  When I click link "My Drafts"
  Then I should see "Story Title"
  Then I should see "Parent Story"
  Then I should see "Publisher"
  Then I should see "Last updated on"

  When I click link "De-activated Stories"
  Then I should see "Story Title"
  Then I should see "Parent Story"
  Then I should see "Last updated on"

  When I click link "My Submitted Stories"
  Then I should see "Story Title"
  #Then I should see "Language"
  Then I should see "English Title"
  Then I should see "Contest Name"

#Validate My Details

  When I click link "My Details"
  Then I should see "Want to change the way your name appears on StoryWeaver?"
  Then I should see "First Name"
  Then I should see "user[first_name]" contains "Common Man"
  Then I should see "user@sample.com"
  Then I should see news letter checkbox as "checked"
  Then I should see "Become an Organisational User"
  When I click button "commit" with value "Submit"
  Then I should see "Your changes have been saved."

  When I fill in "user[first_name]" with ""
  When I fill in "user[last_name]" with ""
  When I fill in "user[bio]" with ""
  When I fill in "user[website]" with ""
  When I click button "commit" with value "Submit"
  Then I should see "First Name: can't be blank"

  When I fill in "user[first_name]" with "Content"
  When I fill in "user[last_name]" with "Manager"
  When I fill in "user[bio]" with "Admin"
  When I fill in "user[website]" with "StoryWearver.org"
  When I click button "commit" with value "Submit"
  Then I should see "Your changes have been saved."

#Change Password
  When I click "Change Password"

#validate without passing any value into the fields
  When I click button "commit" with value "Save new password "
  Then I should see "can't be blank"

#Validate by giving same password
  When I fill in "user[current_password]" with "content_manager"
  When I fill in "user[password]" with "content_manager"
  When I fill in "user[password_confirmation]" with "content_manager"
  When I click button "commit" with value "Save new password "
  When I wait 2 seconds
  Then I should see "old password and new password should be different"
  
#Validation to change the password
  When I fill in "user[current_password]" with "password"
  When I fill in "user[password]" with "changed_password"
  When I fill in "user[password_confirmation]" with "changed_password"
  When I click button "commit" with value "Save new password "
  And I refresh the page
  And I wait 5 seconds


#Validation for Become an Organisational User
  #Without filling the form click on submit
  When I click "Become an Organisational User"
  When I fill in "user[email]" with "user@sample.com"
  When I fill in "user[password]" with "changed_password"
  And I choose "Log in"
  And I wait 5 seconds
  When I click "Become an Organisational User"
  When I click button "Submit" for "new_organization"
  Then I should see "Organization name can't be blank, Country can't be blank, Number of classrooms can't be blank, Children impacted can't be blank"
  
  #Without filling country, classrooms and children
  When I fill in "organization[organization_name]" with "Content"
  Then I should see "Country can't be blank, Number of classrooms can't be blank, Children impacted can't be blank"
  When I click button "Submit" for "new_organization"

  #Without selecting class and children
  And I wait 5 seconds
  When I click at "Select Country"
  And I wait 5 seconds
  When I fill in "Brazil" for ".input-block-level.form-control"
  And I click at "Brazil"
  When I click button "Submit" for "new_organization"
  Then I should see "Number of classrooms can't be blank, Children impacted can't be blank"

  #Trying to give characters in classrooms and children
  When I fill in "organization[number_of_classrooms]" with "testing"
  When I fill in "organization[children_impacted]" with "testing"
  When I click button "Submit" for "new_organization"
  Then I should see "Number of classrooms can't be blank, Children impacted can't be blank"

  #Filling the form with valid data
  When I fill in "organization[number_of_classrooms]" with "2"
  When I fill in "organization[children_impacted]" with "50"
  When I fill in "organization[city]" with "Brazil"
  When I click button "Submit" for "new_organization"
  And I wait 5 seconds
  And I refresh the page
  And I wait 5 seconds
  Then I should not see "Become an Organisational User"
