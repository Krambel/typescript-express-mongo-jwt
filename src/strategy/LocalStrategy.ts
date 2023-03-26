import { Strategy } from 'passport-local'
import { StatusCodes } from 'http-status-codes'
import { compare } from 'bcrypt'

import { UserModel } from '../users'

export const localStrategy = new Strategy(
  { passReqToCallback: true, usernameField: 'email' },
  async (request, email, password, done) => {
    const user = await UserModel.findOne({ email })
    if (!user) return request.res!.status(StatusCodes.BAD_REQUEST).send('Wrong credentials')
    const match = await compare(password, user.password)
    if (!match) return request.res!.status(StatusCodes.BAD_REQUEST).send('Wrong credentials')
    return done(null, { id: user.id })
  }
)
