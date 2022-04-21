export const parseAmountInRupees = (am, decimal = true) => {
  const amount = Number(am) / 100
  return decimal ? Number(amount.toFixed(2)) : amount
}
export const RUPEE_SYMBOL = '₹'

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function formatAMPM(date) {
  var hours = date.getHours()
  var minutes = date.getMinutes()
  var ampm = hours >= 12 ? 'pm' : 'am'
  hours = hours % 12
  hours = hours ? hours : 12 // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes
  var strTime = hours + ':' + minutes + ':' + ampm
  return strTime
}

export const parseDateReadable = (dateParam, withTime = false) => {
  const date = new Date(dateParam)
  const dateStr = date.getDate()
  const monthStr = months[date.getMonth()]
  const yearStr = date.getFullYear()
  return withTime
    ? `${dateStr}-${monthStr}-${yearStr}:${formatAMPM(date)}`
    : `${dateStr}-${monthStr}-${yearStr}`
}
