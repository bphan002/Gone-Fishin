// import { select } from 'd3'
//not working for some

document.addEventListener("DOMContentLoaded", () => {
//when browser has finish loading....
    //fires when everything is ready when DOM is ready
    //safeguard between trying to access element before domtree has fully loaded
    // put all your dom manipulations here

    const h1 = d3.select('h1').style('color', 'green')
    const fishProfileContainer = document.querySelector("[fish-profile-container]")
    const fishProfileTemplate = document.querySelector("[fish-profile-template]")
    const search = document.querySelector("[data-search]")
    
    
    const svg = d3.select('svg')
    
    const width = +svg.attr('width') //from index.html
    const height = +svg.attr('height') // from index.html
    
    
    

  
    


    // const makeGraph = data => {    
       
    //     data.forEach(fish => {
    //         const xAxis = d3.scaleLinear()
    //         .domain([0, d3.max(data, fish => fish.Calories)]) //d3.max is a built in d3 function to claculate max working
    //         .range([0, width]) //width from html svg working
    //     // console.log(xScale.domain())
    //     // console.log(data)

    //     const yAxis = d3.scaleBand()
    //         .domain(data.map(fish => fish['Species Name']))
    //         // .range(])
    //         .range([0,height])
    //         console.log(yAxis.domain())

    //         // console.log(fish.Calories)
    //         svg.selectAll('rect').data(fish)
    //         .enter().append('rect')
    //             // console.log(+fish.Calories) // + just changes to integer
    //             // .attr('width', 200)
    //             .attr('y', d => yAxis(fish['Species Name']))
    //             .attr('width', fish => xScale(+fish.Calories))
    //             .attr('height', yAxis.bandwidth()) //bandwidth is computed with of a single bar
    //     })
    // }




    
    
    
    let fishes = []

    search.addEventListener("input", e => {
        const value = e.target.value.toLowerCase()
        // console.log(fishes)
        fishes.forEach(fish => {
            const isVisible = fish.name.toLowerCase().includes(value)
            fish.element.classList.toggle("hide", !isVisible)
            // fish.element.classList.toggle("hide", !isVisble)
        })
        // console.log(fishes)
    })

// horizonal bar chart
    // const render = data => {
    //     console.log(data)
    //     const xAxis = d3.scaleLinear()
    //         // console.log(data.Protein)
    //         // .domain([0,d3.max(data, fish => fish.Sodium)])
    //         .domain([0,100])
    //         .range([0, width])  //width of bars for bar chart

    //     const yAxis = d3.scaleBand()
    //         .domain(data.map(fish => fish['Species Name']))
    //         .range([0,height])

    //     // console.log(xAxis.domain())
    //     svg.selectAll('rect').data(data)
    //         .enter().append('rect')  //.enter is on the entered selection we want to append
    //         .attr('y', fish => yAxis(fish['Species Name']))
    //         .attr('width', fish => xAxis(fish['Calories']))
    //         // console.log(svg.width)
    //         // .attr('width', 300)
    //         // .attr('height',yAxis.bandwidth())
    //     }

// vertical bar chart
        const render = data => {
            console.log(data)
            const xAxis = d3.scaleBand()
                // console.log(data.Protein)
                // .domain([0,d3.max(data, fish => fish.Sodium)])
                .domain(data.map(fish => fish['Species Name']))
                .range([0,width])

                console.log(xAxis.domain())
    
            const yAxis = d3.scaleLinear()


                .domain([0,100])
                .range([height, 0])  //width of bars for bar chart
    
            // console.log(xAxis.domain())
            svg.selectAll('rect').data(data)
                .enter().append('rect')  //.enter is on the entered selection we want to append
                .attr('x', fish => xAxis(fish['Species Name']))
                .attr('height', fish => height - yAxis(fish['Calories']))
                // console.log(svg.width)
                // .attr('width', 300)
                .attr('width',xAxis.bandwidth())
            }

    async function fetchFishes() {
        // const apiUrl = "https://www.fishwatch.gov/api/species"
        fetch("https://www.fishwatch.gov/api/species")
        .then ((resp) => {
            return resp.json()
        })
        .then(data => {
            data.forEach( fish => {
                // console.log(fish.Calories)
                // fish.Calories = +data.Calories
            })
            render(data)    

            //second function
            console.log(data)
            fishes = data.map(fish => {

                // console.log(fish)

                
                const profile = fishProfileTemplate.content.cloneNode(true).children[0]
                const name = profile.querySelector("[data-SpeciesName]") 
                const description = profile.querySelector("[data-physicalDescription]") 
                const fishImage = profile.querySelector("[data-image]")
                name.innerHTML = fish["Species Name"]
                description.innerHTML = fish["Physical Description"]
                // console.log(fish['Image Gallery'])
                // const fishimageAPI =  fish['Image Gallery'][0]['src'] === undefined ? fish['Image Gallery'][0]['src'] : src/image/noFish.jpeg
                // console.log(fishimageAPI)
                // fishImage.innerHTML = `<img src=${fishImageAPI}>`
                fishProfileContainer.append(profile)
                return { name: fish["Species Name"], element: profile}
            })
            
        })
        
        // console.log(parsedData)
        // const profile = fishProfile.textContent.cloneNode(true) 
        // console.log(profile)
    }
    
    fetchFishes()
    
})