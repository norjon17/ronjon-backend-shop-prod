import { NextFunction, Request, Response } from 'express'
import admin from 'firebase-admin'
import path from 'path'
import logging from '../config/logging'
import { NAMESPACE } from '../constants/values'
// @ts-ignore
import serviceAccount from '../config/firebase-dev.json'

const BUCKET = 'ronjon-clothes-shop-dev.appspot.com'

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: BUCKET
})

const bucket = admin.storage().bucket()

// THIS THING IS WORKING
export const uploadImage = (req: Request, res: Response, next: NextFunction) => {
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
      logging.error(NAMESPACE, e)
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
