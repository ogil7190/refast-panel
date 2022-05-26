const getHost = () => {
  const currDate = new Date().getDate()
  if (currDate < 15) {
    return 'https://refastapp-backend.herokuapp.com'
  } else {
    return 'https://refastapp-bckend.herokuapp.com'
  }
}
export const HOST = 'https://refast.xyz'
export const URL_VERIFY = '/auth/verify'
export const URL_AUTH_LOGIN = '/auth/internal/login'
export const GET_STATS_URL = `${HOST}/panel/stats`
export const GET_ORDERS_URL = `${HOST}/panel/allOrders`
export const GET_USERS_URL = `${HOST}/panel/allUsers`
export const GET_USER_BY_ID_URL = `${HOST}/panel/getUserById`
export const GET_ORDER_BY_ID_URL = `${HOST}/panel/getOrderById`
export const GET_BALANCE_BY_UID_URL = `${HOST}/panel/getBalanceByUid`
