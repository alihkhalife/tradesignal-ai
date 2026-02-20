export function calculatePositionSize(
  capital: number,
  riskPercent: number,
  entryPrice: number,
  stopLossPrice: number
): { positionSize: number; riskAmount: number; units: number } {
  const riskAmount = capital * (riskPercent / 100)
  const stopDistance = Math.abs(entryPrice - stopLossPrice)

  if (stopDistance === 0) {
    return { positionSize: 0, riskAmount, units: 0 }
  }

  const units = riskAmount / stopDistance
  const positionSize = units * entryPrice

  return {
    positionSize: Math.round(positionSize * 100) / 100,
    riskAmount: Math.round(riskAmount * 100) / 100,
    units: Math.round(units * 10000) / 10000,
  }
}

export function calculateRiskReward(
  entryPrice: number,
  stopLossPrice: number,
  takeProfitPrice: number
): number {
  const risk = Math.abs(entryPrice - stopLossPrice)
  const reward = Math.abs(takeProfitPrice - entryPrice)

  if (risk === 0) return 0
  return Math.round((reward / risk) * 100) / 100
}

export function calculatePnL(
  direction: 'long' | 'short',
  entryPrice: number,
  exitPrice: number,
  positionSize: number
): { pnl: number; pnlPercentage: number } {
  const units = positionSize / entryPrice
  let pnl: number

  if (direction === 'long') {
    pnl = (exitPrice - entryPrice) * units
  } else {
    pnl = (entryPrice - exitPrice) * units
  }

  const pnlPercentage = (pnl / positionSize) * 100

  return {
    pnl: Math.round(pnl * 100) / 100,
    pnlPercentage: Math.round(pnlPercentage * 100) / 100,
  }
}

export function suggestStopLoss(
  direction: 'long' | 'short',
  entryPrice: number,
  atr: number,
  multiplier: number = 1.5
): number {
  if (direction === 'long') {
    return Math.round((entryPrice - atr * multiplier) * 100) / 100
  }
  return Math.round((entryPrice + atr * multiplier) * 100) / 100
}

export function suggestTakeProfits(
  direction: 'long' | 'short',
  entryPrice: number,
  stopLossPrice: number,
  ratios: number[] = [2, 3, 4]
): number[] {
  const risk = Math.abs(entryPrice - stopLossPrice)

  return ratios.map((ratio) => {
    if (direction === 'long') {
      return Math.round((entryPrice + risk * ratio) * 100) / 100
    }
    return Math.round((entryPrice - risk * ratio) * 100) / 100
  })
}
