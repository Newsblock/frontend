# Frontend for Newsblock.io

[![Build Status](https://api.travis-ci.org/Newsblock/frontend.svg?branch=master)](https://travis-ci.org/Newsblock/frontend)

### The What 
![homepage](https://cloud.githubusercontent.com/assets/425966/14403941/f8e8151e-fe37-11e5-9f36-8fe9ae9b5a6d.png)

### Download
```
$ git clone git@github.com:Newsblock/frontend.git
```

### Get running locally

```
$ npm install
$ gulp
```

open http://localhost:4000

### Hosting
Easy to host on Heroku
- Install [heroku toolbelt](https://toolbelt.heroku.com/)
```
$ heroku login
$ heroku create
$ heroku config:set NPM_CONFIG_PRODUCTION=false
$ git push heroku master
```
