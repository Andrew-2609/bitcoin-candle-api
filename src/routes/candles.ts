import { Request, Response, Router } from 'express'
import { CandleController } from '../controllers/CandleController'

export const candleRouter = Router()
const candleController = new CandleController()

candleRouter.get(`/:quantity`, async (req: Request, res: Response) => {
  const quantity = parseInt(req.params.quantity)
  const latestCandles = await candleController.findLatestCandles(quantity)
  return res.json(latestCandles)
})