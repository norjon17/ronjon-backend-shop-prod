import express from 'express'
import logging from '../config/logging'
import { NAMESPACE } from '../constants/values'
import { ShopItemModel, ItemTypes } from '../models/ShopItemModel'
import { verifyJWT } from '../middleware/cookieJWT'
import multer from 'multer'
import path from 'path'
// import { uploadImage } from '../services/firebase'
import { uploadImage, imageDelete, bucket, IMAGE_PATH } from '../services/test/fb'

const route = express()

const opts = { runValidators: true }

/*

DO NOT DELETE BELOW

*/
// UPLOADING TO STORAGE OR LOCAL STORAGE ON SERVER
// const storage = multer.diskStorage({
//   destination: (red, file, cb) => {
//     // cb(null, '/public/images')
//     // GETTING ERROR BECAUSE THE FOLDER DOESN"T EXISTS
//     // cb(null, path.join(__dirname, '/src/public/images'))
//     cb(null, __dirname + '/../public/images')
//   },
//   filename: (req, file, cb) => {
//     console.log(file)
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
//     cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`)
//   }
// })
// const upload = multer({ storage: storage })

/*

DO NOT DELETE UP

*/

// CUSTOM UPLOAD TO FIREBASE
const upload = multer({ storage: multer.memoryStorage() })

// READ DATA
route.get('/', async (req, res) => {
  try {
    const data = await ShopItemModel.find()
    res.send({ items: data })
  } catch (e) {
    res.send(e)
  }
})

// READ SINGLE DATA
route.get('/read/:id', verifyJWT, async (req, res) => {
  const id = req.params.id
  // console.log(id)
  try {
    const data = await ShopItemModel.findById(id)
    res.send({ item: data })
  } catch (e) {
    res.send(e)
  }
})

// INSERT DATA
route.post('/create', verifyJWT, upload.single('imageFile'), uploadImage, async (req, res) => {
  const data = req.body as ItemTypes

  // const recommended = typeof data.recommended === 'string' ? (data.recommended === 'true' ? true : false) : false
  const { firebaseUrl, imageName } = req.body
  // console.log(firebaseUrl)
  // console.log(imageName)
  const doc = new ShopItemModel({
    ...data,
    image: firebaseUrl,
    imageName: imageName
  })
  try {
    await doc.save()
    logging.info(NAMESPACE, `Data has been inserted.`)
    return res.status(200).json({ message: 'inserted' })
  } catch (e) {
    logging.error(NAMESPACE, `${e}`)
    // return res.send({ message: 'Error encoutered', ...(e as object) })
    return res.status(400).send({ message: 'Error encoutered', ...(e as object) })
  }
})

// UPDATE ONE DATA
route.put('/updateone/:id', verifyJWT, upload.single('imageFile'), uploadImage, async (req, res) => {
  const _id = req.params.id
  const data = req.body as ItemTypes
  // logging.info(NAMESPACE, JSON.stringify(data))
  const { firebaseUrl, imageName } = req.body
  try {
    // validate if empty object since the validator sucks
    if (JSON.stringify(data) === JSON.stringify({})) {
      return res.status(403).json({ message: 'Invalid input. Please try again.' })
    }
    // validate if wrong object
    if (!data.title || /^\s*$/.test(data.title)) {
      return res.status(403).json({ message: 'Error encountered.', errors: { title: { message: 'The title field is required.' } } })
    }

    const currentShopItem = ShopItemModel.findById(_id)
    !currentShopItem && res.status(403).json({ message: 'Something went wrong. Please try again' })

    await ShopItemModel.findByIdAndUpdate(_id, { ...data, image: firebaseUrl, imageName: imageName }, opts)

    return res.status(200).json({ message: 'updated' })
  } catch (e) {
    logging.error(NAMESPACE, `${e}`)
    return res.status(403).json({ message: 'Error encountered', ...(e as object) })
  }
})

// delete one
// url for delete /deleteone/:id
route.delete('/deleteone/:id', verifyJWT, async (req, res) => {
  const id = req.params.id
  try {
    // await ShopItemModel.findByIdAndDelete(_id)
    const data = await ShopItemModel.findById(id)

    if (data) {
      if (data.imageName !== '') {
        const file = bucket.file(IMAGE_PATH + data.imageName)
        await file.delete()
      }
      await data.deleteOne()
      return res.status(200).json({ message: 'deleted' })
    } else {
      return res.sendStatus(404)
    }
  } catch (e) {
    logging.error(NAMESPACE, `${e}`)
    return res.status(403).json({ message: 'Something went wrong. Please try again' })
  }
})

export default route
