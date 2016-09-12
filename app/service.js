'use strict'

import angular from 'angular'

class DataService {
  constructor ($http) {
    this.$http = $http
  }

  get () {
    return this.$http.get('/nodes', { cache: true })
  }

  update (id, group, targets, value) {

  }

  put (node) {
    return this.$http.put('/nodes', node)
  }

  delete (id) {
  }
}

export { DataService }
