import * as cors from 'cors'
import * as express from 'express'
import * as logger from 'morgan'
import { candleRouter } from './routes/candles'

export const app = express()
app.use(express.json())
app.use(cors())
app.use(logger('dev'))

// Routes
app.use(`/candles`, candleRouter)
