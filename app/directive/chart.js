'use strict'

import * as d3 from 'd3'
import angular from 'angular'
// import init from './init'

class ChartDirective {
  constructor (dataService) {
    this.dataService = dataService
    this.restrict = 'A'
    this.scope = {
      delay: '@'
    }
  }

  link (scope, element, attrs) {
    var svgNode = element[0]
    var svg = d3.select(svgNode)
    var color = d3.scaleOrdinal(d3.schemeCategory20)
    var width = window.innerWidth
    var height = window.innerHeight

    var dataService = this.dataService

    // Handling service data
    dataService.get(function (data) {
      // Hiding animated logo
      var animatedLogo = d3.select('.logo.animated')
      var scopeDelay = scope.delay
      var delayTimeMs = parseFloat(scopeDelay) * 1000

      // Handling svg initializion wait time for logo animation.
      // I think while purpose of using this are DOM and SVG,
      // d3.timeout would be more semantic to use over angular $timeout.
      d3.timeout(draw, delayTimeMs)

      // D3 drawing initialization
      function draw () {
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

        var drag = d3.drag()
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended)

        var node = svg.append('g')
          .attr('class', 'nodes')
          .selectAll('circle')
          .data(data.nodes)
          .enter().append('circle')
            .attr('fill', (d) => color(d.group))
            .call(drag)

        node.filter((d) => d.group === -1)
          .attr('class', 'logo')
          .attr('fill', 'url(#image)')

        node.append('title')
          .text((d) => d.id)

        simulation
          .nodes(data.nodes)
          .on('tick', ticked)

        simulation.force('link')
          .links(data.links)

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

        d3.interval(update, 1000)

        function update (argument) {
          simulation = simulation.restart()
          simulation
            .force('link', d3.forceLink()
              .id((d) => d.id)
              .distance(86)
              .strength(0.5)
            )
            .force('charge', d3.forceManyBody())
            .force('center', d3.forceCenter(width / 2, height / 2))

          var n = { id: 'deren', group: parseInt(Math.random() * 10) }
          var n2 = { id: 'krauf', group: parseInt(Math.random() * 10) }
          data.nodes.push(n)
          data.links.push({
            source: n.id,
            target: data.nodes[parseInt(Math.random() * 10)].id,
            value: 3
          })

          svg.select('g.nodes')
            .selectAll('circle')
            .data(data.nodes)
            .enter().append('circle')
              .attr('fill', (d) => color(d.group))
              .call(drag)

          node = svg.select('g.nodes').selectAll('circle')
          node.exit().remove()

          simulation.alphaTarget(0.3).restart()

          svg.select('g.links')
            .selectAll('line')
            .data(data.links)
            .enter().append('line')
              .attr('stroke-width', (d) => Math.sqrt(d.value))

          line = svg.select('g.links').selectAll('line')
          line.exit().remove()

          simulation
            .nodes(data.nodes)
            .force('link')
            .links(data.links)
        }
      }
    })
  }

  // This is a ES6 workaround to fix dependency injection in Angular
  // directives, since they are expected to return factory and not
  // constructor.
  // For more information: http://stackoverflow.com/a/31623459
  static directiveFactory (dataService) {
    return new ChartDirective(dataService)
  }
}

export { ChartDirective }
