import {select, scaleBand, scaleLinear, axisLeft, axisBottom } from "d3"

const svg = select('svg')
const flexContainer = document.querySelector(".flex-container")
const width = flexContainer.clientWidth
const height = +svg.attr('height')
let xrange = width - 30



export function graph(data) {
    svg.selectAll("*").remove()

    const margin = {
        top: 15,
        right: 100,
        bottom: 250,
        left: 100
    }

    // if (data.length > 4) {
    //     margin.bottom = 250
    // }
    const graphWidth = width - margin.left - margin.right
    const graphHeight = height - margin.top - margin.bottom

    let screenWidth = window.innerWidth
    let fishNameSpace = -9
    let yName = 250
    if (screenWidth < 600) {
        data = data.slice(0,3)
        fishNameSpace = 0
        yName = 360
    } else if (screenWidth < 850) {
        data = data.slice(0,5)
    } else if (screenWidth < 1348) {
        data = data.slice(0, 10) //to make graph still readable
    } else {
        data = data.slice(0,20)
    }


    let rotation = -90
    let anchor = "end"
    if (data.length < 2) {
        rotation = 0
        anchor = "middle"
    }

    let fontSize = 25
    let distanceCorrection = 0
    let xrange = graphWidth
    let singleFishSize = 12
    if (data.length < 2 ) {
        anchor='middle'
        singleFishSize = 30
        // xrange = 100
        distanceCorrection = 50
        if (screenWidth > 850) {
            // xrange = 350
        }
     
        // if (screenWidth < 850) {
        //     fontSize = 18 - data.length
        // }
    } else if (data.length < 3) {
        singleFishSize = 30
        // distanceCorrection = 20
        anchor = "end"
        // fontSize = 25
        // if  (screenWidth < 850) {
        //     fontSize = 18 - data.length
        // } 
    } else if (data.length < 4) {
        singleFishSize = 18
        // fontSize = 30
        // distanceCorrection = 50
        rotation = -90
        anchor = "end"
        // if (screenWidth < 450) {
        //     fontSize = 25
        // } else if (screenWidth < 850) {
        //     fontSize = 18 - data.length
        // }
    } else {
        // fontSize = 40
        singleFishSize = 16
        rotation = -90
        anchor = "end"
    }

       let titleDistanceCorrection = 0;
       if (data.length < 2 && screenWidth < 850) {
            singleFishSize = 25
            titleDistanceCorrection = 194
            distanceCorrection = 40
            // fontSize = 25
            // xrange = 160
        } else if (data.length < 4 && screenWidth < 850) {
            anchor="center"
            rotation = 0
            singleFishSize = 14
            if (screenWidth < 450) {
                rotation = -90
                anchor="end"
            
            } else if (screenWidth < 600) {
                singleFishSize = 10
            } else if (screenWidth < 700) {
                rotation = -90
                anchor="end"
            }
        }else if (data.length < 4 && screenWidth > 850) {
            // xrange = 800
            fontSize = 30
            rotation = 0
            anchor = "middle"
            singleFishSize = 20
            if (screenWidth < 1300) {
                // xrange = 400
            }
            if (data.length < 2) {
                // xrange = 400
                // fontSize = 30
                singleFishSize = 30
            }
        } else if (data.length < 6 && screenWidth > 850) {
            // xrange = 800
            fontSize = 30
            anchor = "end"
            singleFishSize = 18
            rotation = -90
            if (screenWidth > 1600) {
                // xrange = 1500
                singleFishSize = 20
                rotation = 0
                anchor= "middle"
            } else if (screenWidth < 1300) {
                xrange = 600
            }
        } else if (data.length >=2 && screenWidth < 400) {
            // xrange = graphWidth - 50
            // fontSize = 30
       } else if (data.length >=2 && screenWidth < 576) {
        //    xrange = graphWidth - 100
        
           singleFishSize = 10
           anchor= "end"
           rotation = -90
        }else if (screenWidth < 1348) {
            // xrange = graphWidth - 50
            anchor = "end"
        
       } 
       else if (data.length >=10) {
            if (screenWidth < 1145) {
                // xrange = graphWidth - 300
            }
            // xrange = graphWidth - 200
            anchor = "end"
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
        .range([graphHeight, margin.bottom + margin.top]) ////where to place the y axis line bar at
    
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
        .attr("transform", `translate(0,${graphHeight})`) //this places the x axis horizontal line on the graph
        .call(axisBottom(xScale))
        
    if (screenWidth < 450) {
        root.selectAll("text")
        .attr("ticks",25)
        .attr("y",0)
        .attr("dy",".31em")
        .attr("transform", `translate(${fishNameSpace},10)rotate(${rotation})`)
        .attr("text-anchor", anchor )
        .style("fill", "black")
        .style("font-size", singleFishSize)
        
    } else {
        root.selectAll("text")
        .attr("ticks",16)
        .attr("transform", `translate(${fishNameSpace},10)rotate(${rotation})`)
        .attr("text-anchor", anchor ) //this controls x-axis text in the vertical direction need to make it center for single and 
        .style("fill", "black")
        .style("font-size", singleFishSize)
        
    }

    const yAxis = axisLeft(yScale) //putting axes label
    yAxis(root.append('g'))  // adds the left axis label


    //text for y-axis
    //x controls vertical name placement
    //y controls horizontal placement
    svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", margin.left - 65)
    .attr("x",  - graphHeight/2)
    .style("font-size", fontSize)
    .attr("transform", "rotate(-90)")
    .text("Calories");

    }
    // .range([graphHeight, margin.bottom + margin.top]) 


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