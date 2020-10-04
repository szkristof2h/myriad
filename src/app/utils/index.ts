export const makeId = () => {
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  const text = new Array(20)
    .fill("")
    .map(_ => possible.charAt(Math.floor(Math.random() * possible.length)))
    .join("")

  return text
}
