import { cloneDeep } from 'lodash'

const store = {}

const multiGet = (keys) => {
  const data = []
  keys.forEach((key) => {
    data.push([key, localStorage.getItem(key)])
  })
  return data
}

const multiSet = (items) => {
  items.forEach((item) => {
    localStorage.setItem(item[0], item[1])
  })
}

export const loadDataInMemory = (keys = Object.keys(Keys)) => {
  const data = multiGet(keys)

  data.forEach((dataArray) => {
    const _value = JSON.parse(dataArray[1])
    store[dataArray[0]] = _value
  })
}

export const get = (key) => {
  return cloneDeep(store[key])
}

export const set = (key, value) => {
  store[key] = cloneDeep(value)
}

export const persist = () => {
  const keys = Object.keys(store)
  const items = []

  keys.forEach((key) => {
    if (store[key] !== undefined) {
      const value = JSON.stringify(store[key])
      const item = [key, value]
      items.push(item)
    }
  })

  if (items.length > 0) {
    multiSet(items)
  }
}

export const directGet = (key) => {
  try {
    const item = localStorage.getItem(key)
    return JSON.parse(item)
  } catch {
    return null
  }
}

export const directSet = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {}
}

export const Keys = {
  TOKEN: 'TOKEN',
  USER_DETAILS: 'USER_DETAILS',
  HAVE_PIN: 'HAVE_PIN',
  PIN: 'PIN',
}
