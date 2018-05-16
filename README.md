# Nopal

## Introduction

This is my new portfolio in the works.

It is going to be a representation of some of the valued skills I market and teach.

Nopal is (or going to be):

* Fast
  * Even on mobile
* SPA
  * Rest API authentication
* SEO
  * Despite how painful it can be
* Server side rendered
  * To make extra faster
* Efficient
  * The server doesn't make HTTP calls to itself
* Content managed
  * So you don't have to restart for every new page you add

## Already implemented stuff

* Server side rendering
* Basic user accounts
* Content API

## Technologies

* [Node.js](https://nodejs.org/en/)
* [React](https://reactjs.org/)
* [Express](https://expressjs.com/)
* [Passport](http://www.passportjs.org/)
* [Mustache](https://mustache.github.io/)

## Live demo

[Demo on Heroku](https://nopal.herokuapp.com/)

## Run it all by yerself

```bash
git clone https://github.com/Triforcey/nopal.git
cd nopal
npm i
export DB_URL="Your MongoDB URL" # Default: mongodb://localhost
export DB_NAME="DB to use" # Default: nopal
npm start
```

### Other options

#### Production

```bash
export NODE_ENV=production # Default: Empty
npm run build
```

Production mode will minify bundle.js and do everything else you'd expect it do do.

#### Security

When running behind a secure reverse proxy set the following values:

```bash
export SECURE=true # Default: false
# Required if SECURE is set to true:
export SESSION_SECRETS=comma,seperated,secrets
```

Only the first secret will be used for new sessions, the rest will be used to read old sessions.

Running in secure mode will trust reverse proxies, redirect HTTP to HTTPS, set secure HTTP headers properly, and use the provided session secrets.

#### Other

```bash
export PORT=someport # Default: 3000
```
