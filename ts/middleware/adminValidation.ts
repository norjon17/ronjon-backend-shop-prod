import { Request, Response, NextFunction } from 'express'

export const passwordValidation = (req: Request, res: Response, next: NextFunction) => {
  const { password, confirm_password } = req.body
  if (password && confirm_password) {
    if (password !== confirm_password) {
      return res.status(400).send({ message: 'error encountered', errors: { password: { message: `Password don't match.` } } })
    }
    next()
  } else {
    // req.body.data.errors = { password: { message: 'Password is required.' } }
    next()
  }
}
