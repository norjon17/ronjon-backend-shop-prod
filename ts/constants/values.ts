import dotenv from 'dotenv'

dotenv.config()

export const NAMESPACE = 'SHOP SERVER'

export enum TABLES {
  TB_SHOPITEMS = 'tb_shopitems',
  TB_ADMIN_ACCESS = 'tb_admin_access',
  TB_ADMINS = 'tb_admins'
}

// export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string
// export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string
