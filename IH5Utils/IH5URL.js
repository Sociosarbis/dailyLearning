const protocolRegExp = /^([^:]+:)/
export const urlRegExp = /^(\w+:)?\/*?([^#\?\/:]+)(:\d+)?([^#\?]*?)(\?[^#]*)?(#.*)?$/

function getProtocol(url) {
  const protocol = protocolRegExp.exec(url)
  if (protocol) return protocol[1]
  else return window ? window.location.protocol : ''
}

export class Ih5URL {
  constructor(url) {
    const protocol = getProtocol(url)
    const urlParsedResult = urlRegExp.exec(url)
    if (urlParsedResult && (protocol === 'http:' || protocol === 'https:')) {
      this.isValid = true
      this.protocol = protocol
      this.host = urlParsedResult[2].toLowerCase()
      this.port = urlParsedResult[3] || ''
      this.path = urlParsedResult[4] || ''
      this.search = urlParsedResult[5] || ''
      this.hash = urlParsedResult[6] || ''
    } else {
      this.isValid = false
    }
    this._url = url
  }

  addParams(params, type, prefix) {
    if (params && this.isValid) {
      let paramsMap = this[type]
        .slice(1)
        .split('&')
        .reduce(function(paramsMap, keyPair) {
          const [key, value] = keyPair.split('=')
          if (key) Reflect.set(paramsMap, key, value)
          return paramsMap
        }, {})
      Object.keys(params).forEach(function(key) {
        Reflect.set(paramsMap, key, params[key])
      })
      this[type] =
        prefix +
        Object.keys(paramsMap)
          .map(function(key) {
            return key + '=' + paramsMap[key]
          })
          .join('&')
    }
    return this
  }

  addSearchParams(params) {
    return this.addParams(params, 'search', '?')
  }

  addHashParams(params) {
    return this.addParams(params, 'hash', '#')
  }

  toString() {
    return this.isValid
      ? this.protocol +
          '//' +
          this.host +
          this.port +
          this.path +
          this.search +
          this.hash
      : this._url
  }
}