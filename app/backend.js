'use strict'

import json from '../data/index.json'

function httpBackend ($httpBackend) {
  // Fetching nodes
  $httpBackend.whenGET('/nodes').respond(json);

  // Adding new node
  $httpBackend.whenPUT('/nodes').respond(function(method, url, data) {
    data = typeof data === 'string' && JSON.parse(data)

    var id = data.id
    var group = data.group
    var targets = data.targets
    var value = data.value

    console.log(targets)

    json.nodes.push({ id, group })

    for (var i = targets.length - 1; i >= 0; i--) {
      var target = targets[i]
      json.links.push({ source: id, target, value })
    }

    return [ 200, json, {} ]
  })
}

export { httpBackend }
