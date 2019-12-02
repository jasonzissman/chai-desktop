# Idea
Make an Aelxa skill that exposes command in REST API for a short time. For example:

1. "Alexa, tell chai to turn on Netflix"

2. A object is stored in a datastore with content "turn on Netflix". It is associated with a specific user.

3. Then, an HTTP call to `some-awesome-domain.com/users/124135/feed` returns an object with "turn on Netflix". Once read, the message is deleted. Messages expire after 1 hour and after certain length (e.g. 10 messages max per user).
