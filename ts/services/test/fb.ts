import { NextFunction, Request, Response } from 'express'
import admin from 'firebase-admin'
import path from 'path'
import logging from '../../config/logging'
import { NAMESPACE } from '../../constants/values'
// @ts-ignore
import serviceAccount from '../../config/firebase-dev.json'

// const serviceAccount = credentials as admin.ServiceAccount

export const BUCKET = 'ronjon-clothes-shop-dev.appspot.com'
export const IMAGE_PATH = 'images/shop_items/'

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: BUCKET
})

export const bucket = admin.storage().bucket()

// THIS THING IS WORKING
export const uploadImage = async (req: Request, res: Response, next: NextFunction) => {
  if (req.file) {
    const imgFile = req.file
    const { imageName } = req.body
    console.log(imageName)
    if (imageName) {
      console.log('deleting existing image')
      const file = bucket.file(IMAGE_PATH + imageName)
      await file.delete()
    }

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    const imgName = `${imgFile.fieldname}-${uniqueSuffix}${path.extname(imgFile.originalname)}`

    const file = bucket.file(IMAGE_PATH + imgName)

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

      req.body.firebaseUrl = file.publicUrl()
      req.body.imageName = imgName
      // req.body.firebaseUrl = `https://storage.googleapis.com/${BUCKET}/${imgName}`
      next()
    })

    stream.end(imgFile.buffer)
  } else {
    next()
  }
}

// THIS THING IS WORKING
export const imageDelete = async (req: Request, res: Response, next: NextFunction) => {
  const { imageName } = req.body
  console.log(imageName)
  const file = bucket.file(IMAGE_PATH + imageName)
  try {
    await file.delete()
    next()
  } catch (e) {
    next()
  }
}
