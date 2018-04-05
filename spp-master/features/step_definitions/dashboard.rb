Then (/^I should see news letter checkbox as "([^"]*)"$/) do |value|
  expect(page).to have_xpath(".//*[@id='user_email_preference'][@checked='#{value}']")
end

Then (/^I should not see news letter checkbox as "([^"]*)"$/) do
  expect(page).to has_no_xpath?(".//*[@id='user_email_preference'][@checked='#{value}']")
end

When (/^I select news letter checkbox"$/) do
  check "#user_email_preference"
end