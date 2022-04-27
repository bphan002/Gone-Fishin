import {select, scaleBand, scaleLinear, axisLeft, axisTop, axisBottom, scaleExtent } from "d3"

const svg = select('svg')
const width = +svg.attr('width') //from index.html
const height = +svg.attr('height') // from index.html
let fishAbundancy = {}
let graphTitle;
let xAxisLabel;



export function render(data) {
    svg.selectAll("*").remove(); // removes previous graph
    var margin = {
        top: 15,
        right: 50,
        bottom: 250,
        left: 200
    }
    const graphWidth = width - margin.left - margin.right
    const graphHeight = height - margin.top - margin.bottom



    // console.log(data)
    data = data.slice(0, 20)
    const xScale = scaleBand()
        // console.log(data.Protein)
        // .domain([0,max(data, fish => fish.Sodium)])
        .domain(data.map(fish => fish.name))
        .range([0, graphWidth])
        .padding(0.1)
    // console.log(xScale.domain())


    const yScale = scaleLinear()
        .domain([0, 250])
        .range([graphHeight, margin.bottom + margin.top])  //width of bars for bar chart
    
    const g = svg.append('g') // group element
        .attr('transform', `translate(${margin.left},${margin.top})`)

        
    g.selectAll('rect').data(data)
        .enter().append('rect')
        .attr('x', fish => xScale(fish.name))
        .attr('y', fish => yScale(fish.calories))
        .attr('height', fish => graphHeight - yScale(fish.calories))
        .style("fill", fish => fish.color)
        .transition().duration(2000)
        .delay((d, i) => i * .5)
        .attr('width', xScale.bandwidth())
     
        

    const xAxisG= g.append("g")
        .attr("transform", `translate(0,${graphHeight})`)
        .call(axisBottom(xScale))
        

    let rotation = -90
    let anchor = "end"
    if (data.length < 5) {
        rotation = 0
        anchor = "middle"
    }
    g.selectAll("text")
        .attr("transform", `translate(-12,10)rotate(${rotation})`)
        .attr("text-anchor", anchor )
        .style("fill", "black")
        .style("font-size", 36 - data.length)

    const yAxis = axisLeft(yScale) //putting axes label
    yAxis(g.append('g'))  // adds the left axis label

    svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", margin.left - 50)
    .attr("x", -graphHeight/2)
    .style("font-size", "35px")
    // .attr('transform', "translate('600÷','600')")
    .attr("transform", "rotate(-90)")
    .text("Calories");
    
    data.length > 1 ? xAxisLabel = "Fish Names" : xAxisLabel = "Fish Name"
    svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("y", graphHeight + margin.bottom)
    .attr("x", margin.right + (width/2))
    .style("font-size", "35px")
    // .attr('transform', "translate('600÷','600')")
    // .attr("transform", "rotate(180)")
    .text(xAxisLabel);

    data.length > 1 ? graphTitle = "Fishes" : graphTitle = "Fish"
    g.append("text")
        .attr("x",(graphWidth/2))
        .attr("y", (20+ margin.top + margin.bottom))
        .attr("text-anchor", "middle")
        .style("font-size", "50px")
        .text(graphTitle)
}