'use strict'

import angular from 'angular'

class DataService {
  constructor ($http, $q) {
    this.$http = $http
  }

  get (fn) {
    return this.$http.get('../data/index.json').success((data) => {
      this.data = data
      return fn(data)
    })
  }

  update () {

  }

  put (name, group, targets, value) {
    // body...
  }

  delete () {

  }
}

export { DataService }
