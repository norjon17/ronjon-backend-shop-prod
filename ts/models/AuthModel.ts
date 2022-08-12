import mongoose from 'mongoose'
import { TABLES } from '../constants/values'

const schemaOptions = {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
}

export interface AdminTypes {
  firstname: string
  lastname: string
  middlename: string
  email: string
  password: string
  birthday: Date
  created_at?: string
  updated_at?: string
  token?: string
}

const validateEmail = (email: string) => {
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
}

const AuthSchema = new mongoose.Schema<AdminTypes>(
  {
    firstname: {
      type: String,
      required: [true, 'The first name field is required.']
    },
    lastname: {
      type: String,
      required: [true, 'The last name field is required.']
    },
    middlename: {
      type: String,
      required: [true, 'The middle name field is required.']
    },
    email: {
      type: String,
      required: [true, 'The email field is required.'],
      unique: true,
      email: true,
      lowercase: true,
      validate: [validateEmail, 'Please enter a valid email.']
    },
    password: {
      type: String,
      required: [true, 'The password field is required.'],
      min: 6
    },
    birthday: {
      type: Date,
      required: [true, 'The birthday field is required.']
    }
  },
  schemaOptions
)

export const AuthModel = mongoose.model<AdminTypes>(TABLES.TB_ADMINS, AuthSchema)
