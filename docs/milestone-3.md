# Milestone 3

**Video Link**: [Loom](https://www.loom.com/share/0f54d45cc8344d40b8d3b70694c0ef4c)
**Deployment**: [UMass Spaces](https://umass-spaces.herokuapp.com/)

## Changes

The application runs on an expressjs server. It uses passport to allow users to log in and alter data, but prevents users that do not have an account from calling certain endpoints. The server goes through a database that contains a list of locations and the associated data, as well as a list of usernames and passwords.

The front-end has the addition of a proper location list loaded from the server and it shows addresses on the cards. There is only one html page but it gets served up in several endpoints due to the security features. If the browser detects that the user is logged in it will show several buttons that allow the user to modify data that is presented and add new areas, and it will hide the login and register buttons. However a logged out user is still able to search the database for locations and they will be able to register with a new account and login.

The areas within the database are generated via faker.js. However you can modify all entries and add new ones that will get server up. One thing to note is that the front-end limits the rendered results to 21 so the browser is not overwhelmed with search results. A load more feature would be handy, but is not implemented due to time constraints.

To get a list of buildings and addresses on campus I created a web scraper that you can find [here](https://github.com/Snow-cannon/UMass-buildings-web-scraper.git), and it scrapes [this site](https://www.umass.edu/mail/campus-building-addresses). The locations are not in a database, but loading them from a json file works just as well since it is not being updated.