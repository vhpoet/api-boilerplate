'use strict'

import passport from 'koa-passport'

import { BasicStrategy } from 'passport-http'

const userObj = {
  id: 1,
  name: 'admin'
}

passport.use(new BasicStrategy(
  function (username, password, done) {
    if (username === 'admin' && password === 'thisOneIsVeryStrong!') {
      return done(null, userObj)
    }

    return done('Unknown or invalid account / password')
  }))