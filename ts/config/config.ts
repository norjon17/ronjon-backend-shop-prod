import dotenv from 'dotenv'

const PORT = process.env.PORT || 8001
const HOST = process.env.HOST || 'localhost'

const SERVER = {
  hostname: HOST,
  port: PORT
}

const config = {
  server: SERVER
}

export default config
