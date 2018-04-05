Feature: Validate Read Record of the Stories

@javascript
Scenario: Read Story Count- with login
	Given I mock discourse
	When I create "2" stories with "Fantasy" and "English" and "2" by "user@sample.com" with "English story of Re-Levelled type" and "relevelled"
	When I login as "user@sample.com" with "password"
	Then I should see "Signed in successfully."
	When I click "Read"
	When I wait 10 seconds
	Then I should see 2 stories found
	And I should see story read count as "0"
	When I click on read icon
	When I wait 10 seconds
	When I should see read completed as "false"
	When I click on icon "arrow-right animated shake"
	And I wait 2 seconds
	When I click on icon "arrow-right"
	And I wait 2 seconds
	When I click on icon "arrow-right"
	And I wait 2 seconds
	When I should see read completed as "true"
	And I press "close-button"
	Then I should see story read count as "1"

@javascript
Scenario: Read Story count - without login
	Given I mock discourse
	When I create "2" stories with "Fantasy" and "English" and "2" by "user@sample.com" with "English story of orginal type" and "nil"
	Given I am on the Home page
	When I click "Read"
	When I wait 10 seconds
	Then I should see 2 stories found
	And I should see story read count as "0"
	When I click on read icon
	When I wait 10 seconds
	When I should see story records as "0"
	When I click on icon "arrow-right animated shake"
	When I click on icon "arrow-right"
	When I click on icon "arrow-right"
	When I should see story records as "0"
	And I press "close-button"
	Then I should see story read count as "1"
