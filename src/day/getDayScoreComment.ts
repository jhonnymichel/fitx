function getDayScoreComment(score) {
  if (score === 0) {
    return 'Is this even possible?'
  }

  if (score <= 5) {
    return 'Come on now. Are you even trying?'
  }

  if (score <= 6) {
    return "Just ok. And to be honest, I'm only being nice."
  }

  if (score <= 7) {
    return 'Good job, but you know you can push further!'
  }

  if (score <= 8) {
    return "Oh my god you're gonna get so hot!"
  }

  if (score <= 9) {
    return `This is almost inhuman. That's how much effort you're putting!`
  }

  return 'You are the FITNESS MASTER'
}

export default getDayScoreComment
