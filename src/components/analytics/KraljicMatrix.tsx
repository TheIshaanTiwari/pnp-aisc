'use client'

import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import * as d3 from 'd3'
import { RootState, InventoryItem } from '@/types/store'

interface DataPoint {
  id: string
  name: string
  x: number // supply risk
  y: number // profit impact
  isCritical: boolean
}

export default function KraljicMatrix() {
  const svgRef = useRef<SVGSVGElement>(null)
  const inventory = useSelector((state: RootState) => state.inventory.items)
  const thresholds = useSelector((state: RootState) => state.inventory.kraljicThresholds)

  useEffect(() => {
    if (!svgRef.current || !inventory.length) return

    const margin = { top: 20, right: 20, bottom: 40, left: 40 }
    const width = svgRef.current.clientWidth - margin.left - margin.right
    const height = svgRef.current.clientHeight - margin.top - margin.bottom

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove()

    const svg = d3
      .select(svgRef.current)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    // Create scales
    const xScale = d3.scaleLinear().domain([0, 1]).range([0, width])
    const yScale = d3.scaleLinear().domain([0, 1]).range([height, 0])

    // Create data points
    const data: DataPoint[] = inventory.map((item: InventoryItem) => ({
      id: item.id,
      name: item.name,
      x: item.supplyRisk,
      y: item.profitImpact,
      isCritical: item.isCritical,
    }))

    // Add quadrant lines
    svg
      .append('line')
      .attr('x1', xScale(thresholds.supplyRisk))
      .attr('y1', 0)
      .attr('x2', xScale(thresholds.supplyRisk))
      .attr('y2', height)
      .attr('stroke', '#6B7280')
      .attr('stroke-dasharray', '4')

    svg
      .append('line')
      .attr('x1', 0)
      .attr('y1', yScale(thresholds.profitImpact))
      .attr('x2', width)
      .attr('y2', yScale(thresholds.profitImpact))
      .attr('stroke', '#6B7280')
      .attr('stroke-dasharray', '4')

    // Add quadrant labels
    const labelOffset = 10
    const labels = [
      { text: 'Non-Critical', x: 0, y: 0 },
      { text: 'Leverage', x: width, y: 0 },
      { text: 'Bottleneck', x: 0, y: height },
      { text: 'Strategic', x: width, y: height },
    ]

    svg
      .selectAll('.quadrant-label')
      .data(labels)
      .enter()
      .append('text')
      .attr('class', 'quadrant-label')
      .attr('x', (d) => d.x + (d.x === 0 ? labelOffset : -labelOffset))
      .attr('y', (d) => d.y + (d.y === 0 ? labelOffset : -labelOffset))
      .attr('text-anchor', (d) => (d.x === 0 ? 'start' : 'end'))
      .attr('fill', '#6B7280')
      .text((d) => d.text)

    // Add data points
    svg
      .selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', (d) => xScale(d.x))
      .attr('cy', (d) => yScale(d.y))
      .attr('r', 6)
      .attr('fill', (d) => (d.isCritical ? '#EF4444' : '#3B82F6'))
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .on('mouseover', function (event, d) {
        d3.select(this).attr('r', 8)
        tooltip.style('opacity', 1).html(`${d.name}<br/>Supply Risk: ${d.x.toFixed(2)}<br/>Profit Impact: ${d.y.toFixed(2)}`)
      })
      .on('mousemove', function (event) {
        tooltip
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 10 + 'px')
      })
      .on('mouseout', function () {
        d3.select(this).attr('r', 6)
        tooltip.style('opacity', 0)
      })

    // Add axes
    const xAxis = d3.axisBottom(xScale)
    const yAxis = d3.axisLeft(yScale)

    svg
      .append('g')
      .attr('transform', `translate(0,${height})`)
      .call(xAxis)

    svg.append('g').call(yAxis)

    // Add axis labels
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', height + margin.bottom - 5)
      .attr('text-anchor', 'middle')
      .text('Supply Risk')

    svg
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -margin.left + 10)
      .attr('text-anchor', 'middle')
      .text('Profit Impact')

    // Add tooltip
    const tooltip = d3
      .select('body')
      .append('div')
      .attr('class', 'absolute z-50 rounded bg-black px-2 py-1 text-xs text-white opacity-0 shadow')
      .style('pointer-events', 'none')

    return () => {
      tooltip.remove()
    }
  }, [inventory, thresholds])

  return (
    <div className="h-full w-full">
      <svg ref={svgRef} className="h-full w-full" />
    </div>
  )
} 