

const svg = select('svg')
const width = +svg.attr('width') //from index.html
const height = +svg.attr('height') // from index.html
let fishAbundancy = {}

export function render(data) {
    var margin = {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50
    }
    const graphWidth = width - margin.left - margin.right
    const graphHeight = height - margin.top - margin.bottom

    // console.log(data)
    data = data.slice(0, 20)
    console.log("---", data)
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

    g.append("g")
        .attr("transform", `translate(0,${graphHeight})`)
        .call(axisBottom(xScale))

    g.selectAll("text")
        .attr("transform", "translate(-12,-70)rotate(-90)")
        .style("fill", "#fff")

    const yAxis = axisLeft(yScale) //putting axes label
    yAxis(g.append('g'))  // adds the left axis label
}