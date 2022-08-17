import express from 'express'
import logging from '../config/logging'
import { NAMESPACE } from '../constants/values'
import { AdminTypes, AuthModel } from '../models/AuthModel'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { generateAccessToken, verifyJWT } from '../middleware/cookieJWT'
import multer from 'multer'

const route = express()

// USE MULTER FOR ACCEPTING FORMDATA OR MULTIPART/FORM-DATA
const upload = multer()

// CHECK FOR STAY LOGIN OR REFRESH TOKEN
route.get('/', verifyJWT, async (req, res) => {
  const id = req.body.id
  // console.log('is this thing working?')
  try {
    const admin = await AuthModel.findById(id)
    if (admin) {
      return res.send({ message: 'access', admin })
    } else {
      return res.status(404).send({ message: 'denied' })
    }
  } catch (e) {
    logging.error(NAMESPACE, JSON.stringify(e))
    return res.send({ message: 'denied', ...(e as object) })
  }
})

// rEGISTER
route.post('/register', async (req, res, next) => {
  try {
    const oldAdmin = req.body as AdminTypes

    // encrypt password
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(oldAdmin.password, salt)
    // assign new admin
    const newAdmin = { ...oldAdmin, password: hashPassword }
    // create new admin
    const createAdmin = new AuthModel({ ...newAdmin })
    await createAdmin.save()

    logging.info(NAMESPACE, `New admin created ${newAdmin.firstname} ${newAdmin.lastname} ${newAdmin.email}`)
    // res.send({ message: 'created' })
    next()
  } catch (e: any) {
    logging.error(NAMESPACE, JSON.stringify(e))
    if (e.code === 11000) {
      res.send({ message: 'error encountered', errors: { email: { message: 'This email is already used in this site.' } } })
    } else {
      res.send({ message: 'error encountered', ...(e as object) })
    }
  }
})

// LOGIN
route.post('/login', upload.none(), async (req, res) => {
  try {
    const { email, password } = req.body
    // logging.info(NAMESPACE, JSON.stringify(adminLogin))
    const adminData = await AuthModel.findOne({ email: email })
    // @ts-ignore
    // console.log(req.body)
    if (adminData) {
      const validPassword = await bcrypt.compare(password, adminData.password)
      let admin = adminData
      admin.password = ''
      // console.log('testing')
      if (validPassword) {
        // SET TOKEN VIA JWT
        const id = admin.id
        // console.log(id)
        // console.log(ACCESS_TOKEN_SECRET)
        // const token = jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: '1h' })
        const token = generateAccessToken(id)
        const refreshToken = jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET as string)
        // SETUP COOKIES AND SEND
        res
          .cookie('token', token, {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            path: '/'
          })
          .cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            path: '/'
          })
          .send({ admin })
        // res.cookie('token', token).cookie('refreshToken', refreshToken).send({ admin })
        // res.send({ token: token, admin })
      } else {
        res.status(403).json({ message: 'Wrong email or password.' })
      }
    } else {
      res.status(403).json({ message: 'Wrong email or password.' })
    }
  } catch (e: any) {
    logging.error(NAMESPACE, JSON.stringify(e))
    res.status(403).json({ message: 'error encountered', ...(e as object) })
  }
})

route.delete('/logout', verifyJWT, (req, res) => {
  return res
    .cookie('refreshToken', null, {
      httpOnly: true,
      sameSite: 'strict',
      path: '/'
    })
    .cookie('token', null, {
      httpOnly: true,
      sameSite: 'strict',
      path: '/'
    })
    .send()
})

export default route
