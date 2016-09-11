'use strict'

import * as d3 from 'd3'
import angular from 'angular'

class ChartDirective {
  constructor (dataService) {
    this.dataService = dataService
    this.restrict = 'A'
    this.scope = {
      delay: '@',
      put: '='
    }
  }

  link (scope, element, attrs) {
    var simulation = d3.forceSimulation()

    var svgNode = element[0]
    var svg = d3.select(svgNode)
    var color = d3.scaleOrdinal(d3.schemeCategory20)
    var width = window.innerWidth
    var height = window.innerHeight
    var node, line, drag

    simulation
      .force('link', d3.forceLink()
        .id((d) => d.id)
        .distance(86)
        .strength(0.5)
      )
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(width / 2, height / 2))

    var dataService = this.dataService

    // Hiding animated logo
    var animatedLogo = d3.select('.logo.animated')
    var scopeDelay = scope.delay
    var delayTimeMs = parseFloat(scopeDelay) * 1000

    // Handling service data
    dataService.get().success((data) => {
      // console.log(data)
      // Handling svg initializion wait time for logo animation.
      // I think while purpose of using this are DOM and SVG,
      // d3.timeout would be more semantic to use over angular $timeout.
      d3.timeout(draw.bind(this, data), delayTimeMs)
    })

    function update (data) {
      simulation
        .nodes(data.nodes)
        .on('tick', ticked)
        .force('link')
        .links(data.links)
    }

    // D3 drawing initialization
    function draw (data) {
      line = svg.append('g')
        .attr('class', 'links')
        .selectAll('line')
        .data(data.links)
        .enter().append('line')
          .attr('stroke-width', (d) => Math.sqrt(d.value))

      drag = d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended)

      node = svg.append('g')
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

      update(data)

      animatedLogo.style('display', 'none')
    }

    scope.$on('putD3', put)

    // adding node
    function put (event, data) {
      console.log('put')
      console.log(data)

      svg.select('g.nodes')
        .selectAll('circle')
        .data(data.nodes)
        .enter().append('circle')
          .attr('fill', (d) => color(d.group))
          .call(drag)

      node = svg.select('g.nodes').selectAll('circle')
      node.exit().remove()

      svg.select('g.links')
        .selectAll('line')
        .data(data.links)
        .enter().append('line')
          .attr('stroke-width', (d) => Math.sqrt(d.value))

      line = svg.select('g.links').selectAll('line')
      line.exit().remove()

      update(data)
    }

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
