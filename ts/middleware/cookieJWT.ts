import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import logging from '../config/logging'
import { NAMESPACE } from '../constants/values'

// AUTH
export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token as string
  const refreshToken = req.cookies.refreshToken as string
  // console.log(req.cookies)
  // console.log('refresh: ' + refreshToken)
  try {
    let tokenExpired = false
    if (token) {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err, decode) => {
        if (!err) {
          logging.info(NAMESPACE, 'TOKEN OK')
          // @ts-ignore
          req.body.id = decode.id
          next()
        } else {
          logging.error(NAMESPACE, 'TOKEN DENIED')
          // return res.status(403).json({ message: 'expired', err })
          tokenExpired = true
        }
      })
    }
    if (refreshToken === undefined) {
      return res.sendStatus(403)
    }
    if (tokenExpired && refreshToken) {
      // @ts-ignore
      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string, (err, decode) => {
        // @ts-ignore
        // console.log(decode)
        if (!err) {
          logging.info(NAMESPACE, 'REFRESH TOKEN OK')
          // @ts-ignore
          req.body.id = decode.id
          next()
        } else {
          logging.error(NAMESPACE, 'REFRESH TOKEN ERROR')
          return res.status(403).json({ message: 'refresh token?', err })
        }
      })
    }
  } catch (err) {
    return res.status(403).json({ message: 'normal error', err })
  }
  // if (token) {
  //   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err, decode) => {
  //     if (!err) {
  //       // @ts-ignore
  //       req.body.id = decode.id
  //       next()
  //     } else {
  //       return res.status(403).json({ message: 'expired', err })
  //     }
  //   })
  // } else if (refreshToken) {
  //   jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string, (err, decode) => {
  //     if (!err) {
  //       // @ts-ignore
  //       const id = decode.id as string
  //       console.log(id)
  //       // const accessToken = generateAccessToken(id)
  //       // // req.body.id = decode.id
  //     } else {
  //       return res.status(403).json({ err })
  //     }
  //   })
  // } else {
  //   return res.status(401).send()
  // }
}

export const generateAccessToken = (id: string) => {
  return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: '15s' })
}
