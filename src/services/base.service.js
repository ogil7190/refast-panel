import { Http } from './http.service'
import * as URLs from '../urls'
import { generateShortId } from '../utils'

class _Service {
  successResponseFormatter(httpResponse) {
    return {
      body: httpResponse?.data,
      status: httpResponse?.status,
      headers: httpResponse?.headers,
      timestamp: Date.now(),
    }
  }

  errorResponseFormatter(httpError) {
    const res = {
      type: httpError.status ? 'HTTP_ERROR' : 'NETWORK_ERROR',
      status: httpError?.status,
      headers: httpError?.headers,
      timestamp: Date.now(),
      error: JSON.stringify(httpError),
    }
    return res
  }

  makeRequestConfig(method, config) {
    const requestConfig = {
      requestId: config.id || generateShortId(),
      url: config.host ? `${config.host}${config.path}` : `${URLs.HOST}${config.path}`,
      method: method || 'GET',
      timeout: 2 * 60 * 1000,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...config.headers,
      },
      params: config.params,
      data: config.data,
    }
    return requestConfig
  }

  execute(config) {
    return Http.execute(config).then((response) => {
      return this.successResponseFormatter(response)
    })
  }

  get(config) {
    const newConfig = this.makeRequestConfig('GET', config)
    return this.execute(newConfig)
  }

  post(config) {
    const newConfig = this.makeRequestConfig('POST', config)
    return this.execute(newConfig)
  }
  put(config) {
    const newConfig = this.makeRequestConfig('PUT', config)
    return this.execute(newConfig)
  }

  delete(config) {
    const newConfig = this.makeRequestConfig('DELETE', config)
    return this.execute(newConfig)
  }

  cancel(id) {
    return Http.cancel(id)
  }

  cancelAll() {
    return Http.cancelAll()
  }
}

export const Service = new _Service()
