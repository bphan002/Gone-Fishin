import {select, scaleBand, scaleLinear, axisLeft, axisBottom } from "d3"

const svg = select('svg')
const svg2 = document.querySelector("svg")
const flexContainer = document.querySelector(".flex-container")
const width = flexContainer.clientWidth
const height = +svg.attr('height')


export function graph(data) {
    svg.selectAll("*").remove()

    const margin = {
        top: 15,
        right: 100,
        bottom: 200,
        left: 200
    }

    if (data.length > 4) {
        margin.bottom = 300
    }
    const graphWidth = width - margin.left - margin.right
    const graphHeight = height - margin.top - margin.bottom

    let screenWidth = window.innerWidth
    let fishNameSpace = -19
    let yName = -285
    if (screenWidth < 401) {
        data = data.slice(0,3)
        fishNameSpace = 0
        yName = 360
    } else if (screenWidth < 850) {
        data = data.slice(0,5)
    } else if (screenWidth < 1276) {
        data = data.slice(0, 10) //to make graph still readable
    } else {
        data = data.slice(0,20)
    }


    let rotation = -90
    let anchor = "end"
    if (data.length < 5) {
        rotation = 0
        anchor = "middle"
    }

    let fontSize;
    let distanceCorrection = 0
    let xrange = graphWidth
    let singleFishSize = 12
    if (data.length < 2 ) {
        fontSize = 30
        singleFishSize = 18
        distanceCorrection = 50
    } else if (data.length < 3) {
        fontSize = 18 - data.length
        singleFishSize = 18
        distanceCorrection = 20
        anchor = "end"
        
    } else if (data.length < 4) {
        fontSize = 18 - data.length
        singleFishSize = 18
        distanceCorrection = 50
        rotation = -90
        anchor = "end"
    } else {
        fontSize = 40
        singleFishSize = 18
        rotation = -90
        anchor = "end"
    }

       let titleDistanceCorrection = 0;
       if (data.length < 2 && screenWidth < 850) {
            fontSize = 30
            titleDistanceCorrection = 194
            distanceCorrection = 40
            xrange = 160
       } else if (data.length >= 2 && screenWidth < 850) {
            fontSize = 30
            titleDistanceCorrection = 35
            distanceCorrection = 40
            xrange = 160 
            singleFishSize = 18
            margin.top = -30
       } else if (data.length >=10) {
        margin.top = -100
       }
    
    const root = svg.append('g') // group element
        .attr("class","graph")
        .attr('transform', `translate(${margin.left},${margin.top})`)
    
    const xScale = scaleBand()
        .domain(data.map(fish => fish.name))
        .range([0, xrange])
        .padding(0.1)
    
  
    const yScale = scaleLinear()
        .domain([0, 220])
        .range([graphHeight, margin.bottom + margin.top]) 

    
    if (screenWidth < 400) {
    root.selectAll('rect').data(data)
        .enter()
        .append('rect')
            .attr('x', fish => xScale(fish.name))
            .attr('y', fish => yScale(fish.calories))
            .attr('height', fish => graphHeight - yScale(fish.calories))
            .style("fill", fish => fish.color)
            .attr('width', xScale.bandwidth()/1.3)
            
    } else {
        root.selectAll('rect').data(data)
        .enter()
        .append('rect')
            .attr('x', fish => xScale(fish.name))
            .attr('y', fish => yScale(fish.calories))
            .attr('height', fish => graphHeight - yScale(fish.calories))
            .style("fill", fish => fish.color)
            .attr('width', xScale.bandwidth())
    }
    root.append("g")
        .attr("transform", `translate(0,${graphHeight})`)
        .call(axisBottom(xScale))
        
    if (screenWidth < 400) {
        root.selectAll("text")
            .attr("ticks",25)
            .attr("transform", `translate(${fishNameSpace},10)rotate(${rotation})`)
            .attr("text-anchor", anchor )
            .style("fill", "black")
            .style("font-size", singleFishSize)
            .attr("y","0")
            .attr("dy","0em")
    } else {
        root.selectAll("text")
        .attr("ticks",25)
        .attr("transform", `translate(${fishNameSpace},10)rotate(${rotation})`)
        .attr("text-anchor", anchor )
        .style("fill", "black")
        .style("font-size", singleFishSize)
    }

    const yAxis = axisLeft(yScale) //putting axes label
    yAxis(root.append('g'))  // adds the left axis label

    svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", margin.left - 85)
    .attr("x", - yName)
    .style("font-size", fontSize)
    .attr("transform", "rotate(-90)")
    .text("Calories");

    }


    // svg.append("text")
    // .attr("class", "x label")
    // .attr("text-anchor", "end")
    // .attr("y", margin.bottom - distanceCorrection)
    // .attr("x", (margin.right + (width)))
  

    // let graphTitle = data.length > 1 ? "Fishes" : "Fish"
    // root.append("text")
    //     .attr("x",(graphWidth/2))
    //     .attr("y", (20+ margin.top + margin.bottom - titleDistanceCorrection))
    //     .attr("text-anchor", "middle")
    //     .style("font-size", "40px")
    //     .text(graphTitle)