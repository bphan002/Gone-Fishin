
//horizonal bar chart
const render = data => {
    console.log(data)
    const xAxis = d3.scaleLinear()
        // console.log(data.Protein)
        // .domain([0,d3.max(data, fish => fish.Sodium)])
        .domain([0,100])
        .range([0, width])  //width of bars for bar chart

    const yAxis = d3.scaleBand()
        .domain(data.map(fish => fish['Species Name']))
        .range([0,height])

    // console.log(xAxis.domain())
    svg.selectAll('rect').data(data)
        .enter().append('rect')  //.enter is on the entered selection we want to append
        .attr('y', fish => yAxis(fish['Species Name']))
        .attr('width', fish => xAxis(fish['Calories']))
        // console.log(svg.width)
        // .attr('width', 300)
        .attr('height',yAxis.bandwidth())
    }