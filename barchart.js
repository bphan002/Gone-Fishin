
const render = data => {
    const xAxis = d3.scaleLinear()
     
        .domain([0,100])
        .range([0, width])

    const yAxis = d3.scaleBand()
        .domain(data.map(fish => fish['Species Name']))
        .range([0,height])

    svg.selectAll('rect').data(data)
        .enter().append('rect')
        .attr('y', fish => yAxis(fish['Species Name']))
        .attr('width', fish => xAxis(fish['Calories']))
        .attr('height',yAxis.bandwidth())
    }