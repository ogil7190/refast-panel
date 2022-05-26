import { Service } from './base.service'
import { Keys, get } from './dataStore.service'
import { generateShortId } from '../utils'

export const genericPost = ({
  path,
  data = {},
  params = {},
  headers = {},
  shouldSendAuthHeader = true,
}) => {
  const _id = generateShortId()

  if (shouldSendAuthHeader) {
    const token = get(Keys.TOKEN) || ''
    headers['auth-token'] = token
  }

  const config = {
    id: _id,
    path,
    data,
    params,
    headers,
  }

  const resultPromise = Service.post(config)
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
