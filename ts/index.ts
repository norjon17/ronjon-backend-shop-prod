import express from 'express'
import mongoose, { ConnectOptions } from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import logging from './config/logging'
import { NAMESPACE } from './constants/values'
import shopItemRoute from './routes/shopitems'
import authRoute from './routes/auth'
import cookieParser from 'cookie-parser'
import path from 'path'
import session from 'express-session'

const app = express()
dotenv.config()

// middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(
  cors({
    credentials: true,
    origin: process.env.ORIGIN,
    methods: ['GET, POST, PUT, DELETE, OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin']
  })
)
app.use(express.static(path.join(__dirname, '/src/public/images')))
// FOR READING COOKIES
app.use(cookieParser())
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET as string,
//     resave: false,
//     saveUninitialized: true,
//     cookie: { httpOnly: true, sameSite: 'none', secure: true, path: '/' }
//   })
// )
// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: false }))

mongoose
  .connect(process.env.CONNECTION_URL as string, { useNewUrlParser: true } as ConnectOptions)
  .then(() => {
    logging.info(NAMESPACE, 'Connected to database.')
  })
  .catch((e) => {
    logging.error(NAMESPACE, e)
  })

// ROUTES
app.use('/api/shop', shopItemRoute)
app.use('/api/auth', authRoute)
app.use((req, res) => {
  res.sendStatus(403)
})

const PORT = process.env.PORT || 8001
// const HOST = process.env.HOST || 'localhost'

app.listen(PORT, () => {
  logging.info(NAMESPACE, `Server is running on port http://localhost:${PORT}`)
})
