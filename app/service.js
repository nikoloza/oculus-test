'use strict'

import angular from 'angular'

class DataService {
  constructor ($http) {
    this.$http = $http
  }

  get () {
    return this.$http.get('../data/index.json', { cache: true })
  }

  update (id, group, targets, value) {

  }

  put (id, group, targets, value) {

  }

  delete (id) {

  }
}

export { DataService }
