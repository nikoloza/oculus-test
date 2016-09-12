'use strict'

import angular from 'angular'

class DataService {
  constructor ($http) {
    this.$http = $http
  }

  get () {
    return this.$http.get('/nodes', { cache: true })
  }

  put (node) {
    return this.$http.put('/nodes', node)
  }

  update () {}
  delete () {}
}

export { DataService }
