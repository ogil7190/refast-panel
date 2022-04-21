const getHost = () => {
  const currDate = new Date().getDate()
  if (currDate < 15) {
    return 'https://refastapp-backend.herokuapp.com'
  } else {
    return 'https://refastapp-bckend.herokuapp.com'
  }
}
export const HOST_URL = 'http://refast-proxy.herokuapp.com'
export const GET_STATS_URL = `${HOST_URL}/panel/stats`
export const GET_ORDERS_URL = `${HOST_URL}/panel/allOrders`
export const GET_USERS_URL = `${HOST_URL}/panel/allUsers`
export const GET_USER_BY_ID_URL = `${HOST_URL}/panel/getUserById`
export const GET_ORDER_BY_ID_URL = `${HOST_URL}/panel/getOrderById`
export const GET_BALANCE_BY_UID_URL = `${HOST_URL}/panel/getBalanceByUid`
