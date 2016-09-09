'use strict'

import * as d3 from 'd3'

class ChartDirective {
  constructor () {
    this.restrict = 'A'
  }

  link (scope, element, attrs) {
    var svgNode = element[0]
    var width = attrs.width
    var height = attrs.height
    var svg = d3.select(svgNode)
    var color = d3.scaleOrdinal(d3.schemeCategory20)

    var simulation = d3.forceSimulation()
      .force('link', d3.forceLink()
        .id((d) => d.id)
        .distance(86)
        .strength(0.5)
      )
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(width / 2, height / 2))

    d3.json('data/index.json', (error, data) => {
      if (error) throw error

      var link = svg.append('g')
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

      var logo = node
        .filter((d) => d.group === -1)
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
        link
          .attr('x1', (d) => d.source.x)
          .attr('y1', (d) => d.source.y)
          .attr('x2', (d) => d.target.x)
          .attr('y2', (d) => d.target.y)

        node
          .attr('cx', (d) => d.x)
          .attr('cy', (d) => d.y)

        logo
          .style('transform-origin', 'center center ' + Math.random())
      }
    })

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
}

export { ChartDirective }
