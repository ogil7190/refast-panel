import { Service } from './base.service'
import { generateShortId } from '../utils'
import { Keys, get } from './dataStore.service'

export const genericFetch = ({ path, params = {}, headers = {}, shouldSendAuthHeader = true }) => {
  const _id = generateShortId()

  if (shouldSendAuthHeader) {
    const token = get(Keys.TOKEN) || ''
    headers['auth-token'] = token
  }

  const config = {
    id: _id,
    path,
    params,
    headers,
  }

  const resultPromise = Service.get(config)
  return {
    resultPromise: (() =>
      new Promise((resolve, reject) => {
        resultPromise
          .then((resp) => {
            resolve(resp)
          })
          .catch(reject)
      }))(),
    cancel: () => {
      Service.cancel(_id)
    },
  }
}
