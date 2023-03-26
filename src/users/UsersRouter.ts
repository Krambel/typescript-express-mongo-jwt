import { Router } from 'express'
import passport from 'passport'

import { usersController } from './UsersController'

export const usersRouter = Router()

usersRouter.route('/me').get(passport.authenticate('jwt', { session: false }), usersController.get)
