# launch-programs
This is one part of a suite of applications meant to facilitate deeper Alexa integration with your desktop PC. Alexa devices can be used to deliver commands that can be executed on a local computer. The net result will be the ability to control your PC with customizable commands like the following:

    "Alexa, tell smart feed to open Bojack Horseman on Netflix."

    "Alexa, tell smart feed to open ESPN in Chrome."

    "Alexa, tell smart feed to shut down my computer".

# To do

* Publish Skill
* Write desktop application that looks for Alexa-assigned tasks
* (stretch goal) update Skill to generate 6 digit ID instead of using Alexa userIDs. Also, update desktop app to use this ID instead of Alexa userID. [Allow multiple userIDs to be associated with one generated ID since different devices may have different alexa userIDs but be under the same person's control.]

# Architecture

- An Alexa skill will handle requests to perform tasks. The tasks will be free-form and following the pattern "Alexa, tell smart feed to open _______". 
- The skill will insert an entry into a database with a unique identifier for that user as well as the captured command.
- An agent on the end-user's PC will poll the database (or use websockets with push) and read any new entries for their configured userID.
- The local agent will parse the task/entry per local rules defined by the local computer. For example - a task saying "open the crown on netflix" could map to a bash script that launches netflix at a URL which launches the Crown.