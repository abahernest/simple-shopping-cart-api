# Technical assignment back-end engineer

As part of an engineering team, you are working on an online shopping platform. The sales team wants to know which items were added to a basket, but removed before checkout. They will use this data later for targeted discounts.

Using the agreed upon programming language, build a solution that solves the above problem.

**Scope**

* Focus on the JSON API, not on the look and feel of the application.

**Timing**

You have one week to accomplish the assignment. You decide yourself how much time and effort you invest in it, but one of our colleagues tends to say: "Make sure it is good" ;-). Please send us an email (jobs@madewithlove.com) when you think the assignment is ready for review. Please mention your name, Github username, and a link to what we need to review.

STEPS TO TEST
1. Clone the repository
2. Install packages 
    `npm install`
IF DOCKER COMPOSE IS INSTALLED
3. Run `docker compose up` to startup the database and api server

IF DOCKER COMPOSE ISNT INSTALLED
3. create a `.env` file that's identical to `.env.config`
4. Run `npm run dev` to start application. (This runs migration and seeds data)

5. Run `npm test` to run tests