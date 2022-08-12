import mongoose from 'mongoose'
import { TABLES } from '../constants/values'

const schemaOptions = {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
}

export type ItemTypes = {
  _id?: number
  subtitle?: string
  recommended?: boolean
  image?: string
  imageName?: string
  imageFile?: FileList
  title?: string
  price?: number
  productDetails?: string
  material?: string
  color?: string
  measurements?: string
  stocks?: number
  created_at?: string
  updated_at?: string
}

const ShopItemSchema = new mongoose.Schema<ItemTypes>(
  {
    title: {
      type: String,
      required: [true, 'The title field is required.']
      // validate: {
      //   validator: (v: string) => v || /^\s*$/.test(v) || JSON.stringify(v) === JSON.stringify({}),
      //   message: 'The title field is required.'
      // }
    },
    image: {
      type: String,
      required: false,
      default: ''
    },
    imageName: {
      type: String,
      required: false,
      default: ''
    },
    subtitle: {
      type: String,
      required: false,
      default: ''
    },
    recommended: {
      type: Boolean,
      required: false,
      default: false
    },
    price: {
      type: Number,
      required: false,
      default: 0
    },
    productDetails: {
      type: String,
      required: false,
      default: ''
    },
    material: {
      type: String,
      required: false,
      default: ''
    },
    color: {
      type: String,
      required: false,
      default: ''
    },
    measurements: {
      type: String,
      required: false,
      default: ''
    },
    stocks: {
      type: Number,
      required: false,
      default: 0
    }
  },
  schemaOptions
)

export const ShopItemModel = mongoose.model<ItemTypes>(TABLES.TB_SHOPITEMS, ShopItemSchema)
