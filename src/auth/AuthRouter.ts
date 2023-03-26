import { Router } from 'express'
import passport from 'passport'

import { authController } from './AuthController'

export const authRouter = Router()

authRouter
  .route('/login')
  .post(passport.authenticate('local', { session: false }), authController.login)

authRouter.route('/sign-up').post(authController.signUp)

authRouter
  .route('/change-password')
  .post(passport.authenticate('jwt', { session: false }), authController.changePassword)
