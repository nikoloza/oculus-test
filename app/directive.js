'use strict'

import * as d3 from 'd3'
import angular from 'angular'

class ChartDirective {
  constructor (angular) {
    this.restrict = 'A'
    this.scope = {
      delay: '@'
    }
  }

  link (scope, element, attrs) {
    var svgNode = element[0]
    var width = window.innerWidth
    var height = window.innerHeight
    var svg = d3.select(svgNode)
    var color = d3.scaleOrdinal(d3.schemeCategory20)

    // // Handling leak for listeners
    // var ngWindow = angular.element(window)
    // var resize = ngWindow.on('reisze', forceCenter)

    // // Remove listener on scope destroy (mainly page leave)
    // scope.$on('$destroy', function () {
    //   ngWindow.off('resize', resize)
    // })

    // function forceCenter (e) {
    //   width = window.innerWidth
    //   height = window.innerHeight
    //   simulation.force('center', d3.forceCenter(width / 2, height / 2))
    // }

    // Handling factory data. It's out of timeout to
    // of gaining extra time for loading data.
    d3.json('data/index.json', (error, data) => {
      if (error) throw error

      // Hiding animated logo
      var animatedLogo = d3.select('.logo.animated')
      var scopeDelay = scope.delay
      var delayTimeMs = parseFloat(scopeDelay) * 1000

      // Handling svg initializion wait time for logo animation.
      // I think while we're still working on DOM and SVF,
      // d3.timeout would be more semantic to use over angular
      // $timeout, not sure about performance yet.
      d3.timeout(() => {
        var simulation = d3.forceSimulation()

        simulation
          .force('link', d3.forceLink()
            .id((d) => d.id)
            .distance(86)
            .strength(0.5)
          )
          .force('charge', d3.forceManyBody())
          .force('center', d3.forceCenter(width / 2, height / 2))

        var line = svg.append('g')
          .attr('class', 'links')
          .selectAll('line')
          .data(data.links)
          .enter().append('line')
            .attr('stroke-width', (d) => Math.sqrt(d.value))

        var node = svg.append('g')
          .attr('class', 'nodes')
          .selectAll('circle')
          .data(data.nodes)
          .enter()
          .append('circle')
          .attr('fill', (d) => color(d.group))
          .call(d3.drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended))

        // Logo
        node.filter((d) => d.group === -1)
          .attr('class', 'logo')
          .attr('fill', 'url(#image)')

        // Title attribute for mouse over
        node.append('title')
          .text((d) => d.id)

        // Simulation per change
        simulation
          .nodes(data.nodes)
          .on('tick', ticked)
        simulation.force('link')
          .links(data.links)

        // Animate nodes and lines
        function ticked () {
          line
            .attr('x1', (d) => d.source.x)
            .attr('y1', (d) => d.source.y)
            .attr('x2', (d) => d.target.x)
            .attr('y2', (d) => d.target.y)

          node
            .attr('cx', (d) => d.x)
            .attr('cy', (d) => d.y)
        }

        animatedLogo.style('display', 'none')

        // Drag event listeners
        function dragstarted (d) {
          if (!d3.event.active) simulation.alphaTarget(0.3).restart()
          d.fx = d.x
          d.fy = d.y
        }
        function dragged (d) {
          d.fx = d3.event.x
          d.fy = d3.event.y
        }
        function dragended (d) {
          if (!d3.event.active) simulation.alphaTarget(0)
          d.fx = null
          d.fy = null
        }
      }, delayTimeMs)
    })
  }
}

export { ChartDirective }
