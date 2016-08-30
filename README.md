<h1 align="center">sensitive-question</h1>
<p align="center">Simple survey app for questions people might not want to answer truthfully.</p>

In statistics, there is an interesting strategy for guaranteeing survey anonymity: randomize whether the subject should lie in their response. If the subject is the only one to see the output of the randomization (coin toss, card deal, etc), then they can be guaranteed an anonymous response. The real percentage of yes/no can be calculated with some simple probability math. Neat huh? 

When I was given a project in a statistics class which required me to implement this, I thought it would be easier to write this app rather than manually interview over 100 people. It's designed to track emails sent to survey subjects, and displays email opens and survey responses in a response dashboard, so you can see who responded and who didn't.

This application is a really simple implementation of that technique, designed to be deployed to Heroku. The frontend is a simple static Angular page using `angular-material`, which calls an incredibly simple API on the backend to submit the result, along with submitting a unique token representing the person taking the survey.
