'use strict'

import angular from 'angular'

class DataService {
  constructor ($http) {
    this.$http = $http
  }

  get (fn) {
    return this.$http.get('../data/index.json').success((data) => {
      this.data = data
      return fn(data)
    })
  }

  update (id, group, targets, value) {

  }

  put (id, group, targets, value) {

  }

  delete (id) {

  }
}

export { DataService }
