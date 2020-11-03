export function getFoodScore(foodCalories = 0) {
  return (foodCalories / 1500) * 10
}

export function getCardioScore(type: 'activeCalories' | 'steps', value = 0) {
  if (type === 'activeCalories') {
    return (value / 400) * 10
  }

  return (value / 10000) * 10
}

export function getStrengthScore(done = false) {
  return done ? 10 : 0
}

function getDayScore({
  food = 0,
  cardio = 0,
  strength = 0,
}: {
  food?: number
  cardio?: number
  strength?: number
}) {
  return food * 0.6 + cardio * 0.2 + strength * 0.2
}

export default getDayScore
