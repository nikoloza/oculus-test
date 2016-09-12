'use strict'

import angular from 'angular'
import json from '../data/index.json'

function httpBackend ($httpBackend, $rootScope) {
  // Fetching nodes
  $httpBackend.whenGET('/nodes').respond(json);

  // Adding new node
  $httpBackend.whenPUT('/nodes').respond(function(method, url, data) {
    data = typeof data === 'string' && JSON.parse(data)

    var id = data.id
    var group = data.group
    var targets = data.targets
    var value = data.value

    var nodes = json.nodes
    var filter = nodes.filter((d) => d.id === id)
    if (!filter.length) nodes.push({ id, group })

    for (var i = targets.length - 1; i >= 0; i--) {
      var target = targets[i]
      var links = json.links
      var filter = links.filter((d) => d.id === id && d.target === target)
      if (!filter.length) links.push({ source: id, target, value })
    }

    return [ 200, json, {} ]
  })
}

export { httpBackend }
