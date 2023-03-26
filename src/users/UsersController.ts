import { Request, Response } from 'express'
import { isValidObjectId } from 'mongoose'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

import * as Interfaces from './interfaces'
import { UserModel } from './UserModel'

async function get(
  req: Request<{ id: string }>,
  res: Response<Interfaces.User | string>
): Promise<Response> {
  if (!req.isAuthenticated())
    return res.status(StatusCodes.UNAUTHORIZED).send(ReasonPhrases.UNAUTHORIZED)
  if (!isValidObjectId(req.user.id))
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).send(ReasonPhrases.UNPROCESSABLE_ENTITY)
  const user = await UserModel.findById(req.user.id)
  if (!user) return res.status(StatusCodes.NOT_FOUND).send(ReasonPhrases.NOT_FOUND)
  return res.status(StatusCodes.OK).send({ id: user.id, email: user.email, roles: user.roles })
}

export const usersController = { get }
