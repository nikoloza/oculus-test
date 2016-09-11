// Handling leak for listeners
var ngWindow = angular.element(window)
var resize = ngWindow.on('reisze', forceCenter)

// Remove listener on scope destroy (mainly page leave)
scope.$on('$destroy', function () {
  ngWindow.off('resize', resize)
})

function forceCenter (e) {
  width = window.innerWidth
  height = window.innerHeight
  simulation.force('center', d3.forceCenter(width / 2, height / 2))
}