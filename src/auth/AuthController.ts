import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import { Request, Response } from 'express'
import { MongoError } from 'mongodb'
import { sign } from 'jsonwebtoken'
import { hash, compare } from 'bcrypt'

import { UserModel } from '../users'
import { config } from '../config'

import * as Interfaces from './interfaces'

async function login(req: Request, res: Response) {
  if (!req.isAuthenticated())
    return res.status(StatusCodes.UNAUTHORIZED).send(ReasonPhrases.UNAUTHORIZED)
  return res
    .status(StatusCodes.OK)
    .send(sign({ id: req.user.id }, config.get('jwt'), { expiresIn: 24 * 60 * 60 })) // 24 hours
}

async function signUp(req: Request<unknown, string, Interfaces.SignUp>, res: Response<string>) {
  try {
    const user = await UserModel.create({
      email: req.body.email,
      password: await hash(req.body.password, 12)
    })
    return res.status(StatusCodes.CREATED).send(user.id)
  } catch (e) {
    if (e instanceof MongoError && e.name === 'MongoServerError' && e.code === 11000) {
      return res.status(StatusCodes.BAD_REQUEST).send('Not unique username')
    }
    throw e
  }
}

async function changePassword(
  req: Request<unknown, string, Interfaces.ChangePassword>,
  res: Response<string>
) {
  if (req.body.password === req.body.newPassword)
    return res.status(StatusCodes.BAD_REQUEST).send('Nothing to change')
  if (!req.isAuthenticated())
    return res.status(StatusCodes.UNAUTHORIZED).send(ReasonPhrases.UNAUTHORIZED)
  const user = await UserModel.findById(req.user.id)
  if (!user) return res.status(StatusCodes.BAD_REQUEST).send('Wrong credentials')
  const match = await compare(req.body.password, user.password)
  if (!match) return res.status(StatusCodes.BAD_REQUEST).send('Wrong credentials')
  await UserModel.findByIdAndUpdate(req.user.id, { password: await hash(req.body.newPassword, 12) })
  return res.status(StatusCodes.OK).send(req.user.id)
}

export const authController = { login, signUp, changePassword }
