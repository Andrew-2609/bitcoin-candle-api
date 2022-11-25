import { config } from 'dotenv'
import { connection } from 'mongoose'
import { app } from './app'
import { connectToMongoDb } from './config/db'
import { CandleMessageChannel } from './messages/CandleMessageChannel'

const createServer = async (): Promise<void> => {
  config()

  await connectToMongoDb()

  const PORT = String(process.env.APP_PORT)
  const server = app.listen(PORT, () => console.log(`App running at ${PORT}`))

  const candleMsgChannel = new CandleMessageChannel(server)
  candleMsgChannel.consumeMessages()

  process.on('SIGINT', async () => {
    await connection.close()
    server.close()
    console.log(`App Server and MongoDB Connection closed`)
  })
}

createServer()
