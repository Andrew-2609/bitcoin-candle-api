import { config } from 'dotenv'
import { connect } from 'mongoose'

export const connectToMongoDb = async (): Promise<void> => {
  config()
  await connect(String(process.env.MONGODB_CONNECTION_URL))
}
