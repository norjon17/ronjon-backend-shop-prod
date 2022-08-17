import { NextFunction, Request, Response } from 'express'
import admin, { ServiceAccount } from 'firebase-admin'
import path from 'path'
import logging from '../config/logging'
import { NAMESPACE } from '../constants/values'
// @ts-ignore
import serviceAccount from '../config/firebase-dev.json'

const BUCKET = 'ronjon-clothes-shop-dev.appspot.com'

// const serviceAccount = {
//   type: process.env.FIREBASE_TYPE,
//   project_id: process.env.FIREBASE_PROJECT_ID,
//   private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
//   private_key: process.env.FIREBASE_PRIVATE_KEY,
//   client_email: process.env.FIREBASE_CLIENT_EMAIL,
//   client_id: process.env.FIREBASE_CLIENT_ID,
//   auth_uri: process.env.FIREBASE_AUTH_URI,
//   token_uri: process.env.FIREBASE_TOKEN_URI,
//   auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
//   client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
// } as ServiceAccount

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: BUCKET
})

const bucket = admin.storage().bucket()

// THIS THING IS WORKING
export const uploadImage = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.file)
  if (req.file) {
    const imgFile = req.file
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    const imgName = `${imgFile.fieldname}-${uniqueSuffix}${path.extname(imgFile.originalname)}`

    const file = bucket.file('images/shop_items/' + imgName)

    const stream = file.createWriteStream({
      metadata: {
        contentType: imgFile.mimetype
      }
    })

    stream.on('error', (e) => {
      // console.error('error while uploading')
      logging.error('FIREBASE UPLOAD', e)
    })

    stream.on('finish', async () => {
      await file.makePublic()

      // @ts-ignore
      req.body.firebaseUrl = file.publicUrl()
      // req.body.firebaseUrl = `https://storage.googleapis.com/${BUCKET}/${imgName}`
      next()
    })

    stream.end(imgFile.buffer)
  } else {
    next()
  }
}
