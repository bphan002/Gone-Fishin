import {select, scaleBand, scaleLinear, axisLeft, axisBottom } from "d3"

const svg = select('svg')
const width = +svg.attr('width')
const height = +svg.attr('height')

export function graph(data) {
    svg.selectAll("*").remove()

    const margin = {
        top: 15,
        right: 50,
        bottom: 250,
        left: 200
    }
    const graphWidth = width - margin.left - margin.right
    const graphHeight = height - margin.top - margin.bottom

    data = data.slice(0, 20) //to make graph still readable
    
    const root = svg.append('g') // group element
        .attr('transform', `translate(${margin.left},${margin.top})`)
    
    const xScale = scaleBand()
        .domain(data.map(fish => fish.name))
        .range([0, graphWidth])
        .padding(0.1)

    const yScale = scaleLinear()
        .domain([0, 250])
        .range([graphHeight, margin.bottom + margin.top]) 

    root.selectAll('rect').data(data)
        .enter()
        .append('rect')
            .attr('x', fish => xScale(fish.name))
            .attr('y', fish => yScale(fish.calories))
            .attr('height', fish => graphHeight - yScale(fish.calories))
            .style("fill", fish => fish.color)
            .transition().duration(2000)
            .delay((d, i) => i * .5)
            .attr('width', xScale.bandwidth())

    //dynamic way to make graph more readable
    let rotation = -90
    let anchor = "end"
    if (data.length < 5) {
        rotation = 0
        anchor = "middle"
    }

    root.selectAll("text")
        .attr("transform", `translate(-12,10) rotate(${rotation})`)
        .attr("text-anchor", anchor )
        .style("fill", "black")
        .style("font-size", 36 - data.length)

    const yAxis = axisLeft(yScale) //putting axes label
    yAxis(root.append('g'))  // adds the left axis label

    svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", margin.left - 50)
        .attr("x", -graphHeight/2)
        .style("font-size", "35px")
        .attr("transform", "rotate(-90)")
        .text("Calories");
    
   
    const xAxisLabel = data.length > 1 ? "Fish Names" : "Fish Name"

    svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("y", graphHeight + margin.bottom)
        .attr("x", margin.right + (width/2))
        .style("font-size", "35px")
        .text(xAxisLabel);

    const graphTitle = data.length > 1 ? "Fishes" : "Fish"
    
    root.append("text")
        .attr("x",(graphWidth/2))
        .attr("y", (20+ margin.top + margin.bottom))
        .attr("text-anchor", "middle")
        .style("font-size", "50px")
        .text(graphTitle)
}