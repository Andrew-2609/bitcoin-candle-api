import { config } from 'dotenv'
import { connection } from 'mongoose'
import { app } from './app'
import { connectToMongoDb } from './config/db'

const createServer = async (): Promise<void> => {
  config()

  await connectToMongoDb()

  const PORT = String(process.env.APP_PORT)
  const server = app.listen(PORT, () => console.log(`App running at ${PORT}`))

  process.on('SIGINT', async () => {
    await connection.close()
    server.close()
    console.log(`App Server and MongoDB Connection closed`)
  })
}

createServer()
