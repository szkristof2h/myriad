// Node.js implementation of Evan Miller's algorithm for ranking stuff based on upvotes:
// http://www.evanmiller.org/how-not-to-sort-by-average-rating.html
// https://medium.com/@gattermeier/calculating-better-rating-scores-for-things-voted-on-7fa3f632c79d
export const getRating = (upvotes, n = 0, confidence = 0.95) => {
  if (n === 0) return 0

  const z = 1.96 // probit(1 - (1 - confidence) / 2)
  const phat = (1.0 * upvotes) / n

  return (
    (phat +
      (z * z) / (2 * n) -
      z * Math.sqrt((phat * (1 - phat) + (z * z) / (4 * n)) / n)) /
    (1 + (z * z) / n)
  )
}
