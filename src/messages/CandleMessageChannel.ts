import { Channel, connect, ConsumeMessage } from 'amqplib'
import * as http from 'http'
import { Server } from 'socket.io'
import { CandleController } from '../controllers/CandleController'
import { ICandle } from '../models/CandleModel'

export class CandleMessageChannel {
  private channel: Channel
  private candleController: CandleController
  private io: Server

  constructor(server: http.Server) {
    this.candleController = new CandleController()
    this.io = new Server(server, {
      cors: {
        origin: String(process.env.SOCKET_CLIENT_SERVER),
        methods: ['GET', 'POST']
      }
    })

    this.io.on('connection', () => console.log(`WebSocket connection created`))

    this.createMessageChannel()
  }

  private async createMessageChannel() {
    try {
      const connection = await connect(String(process.env.AMQP_SERVER))
      this.channel = await connection.createChannel()
      this.channel.assertQueue(String(process.env.QUEUE_NAME))
    } catch (err) {
      console.error(`Connection to RabbitMQ failed`)
      console.error(err)
    }
  }

  consumeMessages() {
    this.channel.consume(String(process.env.QUEUE_NAME), async (message: ConsumeMessage) => {
      const candle: ICandle = JSON.parse(message.content.toString())
      console.log(`Message received`)
      this.channel.ack(message)

      await this.candleController.save(candle)
      console.log(`Candle saved in the database`)
      this.io.emit(String(process.env.SOCKET_EVENT_NAME), candle)
      console.log(`New Candle emitted by WebSocket`)
    })

    console.log(`Candle Consumer started`)
  }
}
