'use strict'

import angular from 'angular'
import * as d3 from 'd3'
import _merge from 'lodash.merge'

class ChartDirective {
  constructor (dataService) {
    this.dataService = dataService
    this.restrict = 'A'
  }

  link (scope, element, attrs) {
    var simulation = d3.forceSimulation()

    var svgNode = element[0]
    var svg = d3.select(svgNode)
    var color = d3.scaleOrdinal(d3.schemeCategory20)
    var width = window.innerWidth
    var height = window.innerHeight
    var node, line

    var drag = d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended)

    simulation
      .force('link', d3.forceLink()
        .id((d) => d.id)
        .distance(144)
        .strength(0.2)
      )
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(width / 2, height / 2))

    var dataService = this.dataService

    // Hiding animated logo
    var animatedLogo = d3.select('.logo.animated')
    var delayTimeMs = 2400

    // Handling service data
    dataService.get().success((data) => {
      // Handling svg initializion wait time for logo animation.
      // I think while purpose of using this are DOM and SVG,
      // d3.timeout would be more semantic to use over angular $timeout.
      d3.timeout(draw.bind(this, data), delayTimeMs)
    })

    // D3 drawing initialization
    function draw (data) {
      simulation
        .alphaTarget(1)
        .restart()
        .on('tick', ticked)

      line = svg.append('g')
        .attr('class', 'links')
        .selectAll('line')
        .data(data.links)
        .enter().append('line')
          .attr('stroke-width', (d) => Math.sqrt(d.value))

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

      animatedLogo.style('display', 'none')

      simulation
        .nodes(data.nodes)
        .force('link')
        .links(data.links)
    }

    scope.$on('putD3', update)

    // Addding and updating nodes
    function update (event, data) {
      var ref = makeRef(data)
      var refNodes = ref.nodes
      var refLinks = ref.links

      simulation
        .alphaTarget(0.3)
        .restart()

      svg.select('g.nodes')
        .selectAll('circle')
        .data(refNodes)
        .enter().append('circle')
          .attr('fill', (d) => color(d.group))
          .call(drag)

      node = svg.select('g.nodes').selectAll('circle')
      node.exit().remove()

      svg.select('g.links')
        .selectAll('line')
        .data(refLinks)
        .enter().append('line')
          .attr('stroke-width', (d) => Math.sqrt(d.value))

      line = svg.select('g.links').selectAll('line')
      line.exit().remove()

      simulation
        .nodes(refNodes)
        .force('link')
        .links(refLinks)
    }

    // Since we used REST for fetching new data, it kills data reference
    // and D3 data structure, because rest is using string to transfer
    // the data, and we're loosing it somewhere on the road. To keep it
    // referenced, we use old one and merge with new.
    function makeRef (data) {
      var nodeData = node.data()
      var newNodeData = data.nodes
      var nodesMerged = _merge(nodeData, newNodeData)

      var lineData = line.data()
      var newLineData = data.links
      var linksMerged = _merge(lineData, newLineData)

      return {
        nodes: nodesMerged,
        links: linksMerged
      }
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
