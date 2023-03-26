import { StatusCodes } from 'http-status-codes'
import { Strategy, ExtractJwt, VerifyCallbackWithRequest } from 'passport-jwt'

import { config } from '../config'
import { UserModel } from '../users'

const verify: VerifyCallbackWithRequest = async (request, jwt_payload, done) => {
  const user = await UserModel.findById(jwt_payload.id)
  if (!user) return request.res!.status(StatusCodes.BAD_REQUEST).send('Wrong credentials')
  return done(null, { id: user.id })
}
export const jwtStrategy = new Strategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.get('jwt'),
    passReqToCallback: true
  },
  verify
)
