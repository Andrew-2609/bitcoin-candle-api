import { CandleModel, ICandle } from "src/models/CandleModel";

export class CandleController {
  async save(candle: ICandle): Promise<ICandle> {
    const newCandle = await CandleModel.create(candle)
    return newCandle
  }

  async findLatestCandles(quantity: number): Promise<ICandle[]> {
    const n = quantity > 0 ? quantity : 10
    const latestCandles: ICandle[] = await CandleModel.find().sort({ _id: -1 }).limit(n)
    return latestCandles
  }
}
