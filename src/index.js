import {select, scaleBand, scaleLinear, axisLeft, axisTop, scaleExtent } from "d3"

const h1 = select('h1').style('color', 'green')
const fishProfileContainer = document.querySelector("[fish-profile-container]")
const fishProfileTemplate = document.querySelector("[fish-profile-template]")
const search = document.querySelector("[data-search]")
const fishIcon = document.getElementById("image-container")
let fishes; 

//goes throughn nav tags and add an event listener to it
function navFinder() {
    const nav = document.querySelectorAll('nav a')
    nav.forEach((link)=> {
        // console.log(link)
        link.addEventListener('click', () => {
            if (link.dataset.page === "search") {
                console.log(link)
                setPageSearch()
            } else if (link.dataset.page === "graph")  {
                // console.log(link)
                setPageGraph()
            }
        })
    })

    function setPageSearch() {
       console.log(document.querySelector('#image-container'))
        document.querySelector('#image-container').className =  'visible'
        // document.querySelector('.image-container').className ='image-container visible'
        document.querySelector('.svg-container').className = 'svg-container'
    }


    function setPageGraph() {
        console.log(document.querySelector('#image-container'))
        // console.log(document.querySelector('.image-container'))
        document.querySelector('#image-container').className = ''
        // document.querySelector('.image-container').className = 'image-container'
        document.querySelector('.svg-container').className = 'svg-container visible'
    }

}



//create a single fish where it'll display on the page and it'll be invisisble
//then set it to visible


document.addEventListener("DOMContentLoaded",()=> start()) //triggers whole start

async function start() {
     //this is for the search bar filter.  It'll store the filtered fish in an array
    let fishes = []

    //this grabs a key/value pair of the fish and how abundant it is 
    let fishAbundancy = {}
    navFinder()
    //when browser has finish loading....
    //fires when everything is ready when DOM is ready
    //safeguard between trying to access element before domtree has fully loaded
    // put all your dom manipulations here

    //this funciton will be used to redirect to detailed page of a specific fish

    //i want this to listen to a clicked iimage once it is clicked the detailed
    //function will run to change the page to the specific fish deatils 
    fishIcon.addEventListener("click", (e) => {
        const fish = e.target
        const id = fish.dataset['id']
        singleFishPage(fishes[id]) //grabs whole fishes array
    });


    //this is for searchbar
    search.addEventListener("input", e => {
        const value = e.target.value.toLowerCase()
        // console.log(fishes)
        fishes.forEach(fish => {
            const isVisible = fish.name.toLowerCase().includes(value)
            fish.element.classList.toggle("hide", !isVisible)
        })
    })
 
    const svg = select('svg')
    const width = +svg.attr('width') //from index.html
    const height = +svg.attr('height') // from index.html
    // vertical bar chart
    const render = data => {
        var margin = {
            top: 50,
            right: 50,
            bottom: 50,
            left: 50
        }
        const graphWidth = width - margin.left - margin.right
        const graphHeight = height - margin.top - margin.bottom

        // console.log(data)
        const xScale = scaleBand()
            // console.log(data.Protein)
            // .domain([0,max(data, fish => fish.Sodium)])
            .domain(data.map(fish => fish['Species Name']))
            .range([0, graphWidth])
            .padding(0.1)
        // console.log(xScale.domain())


        const yScale = scaleLinear()
            .domain([0, 250])
            .range([graphHeight, margin.bottom + margin.top])  //width of bars for bar chart
        const g = svg.append('g') // group element
            .attr('transform', `translate(${margin.left},${margin.top})`)
        
            const yAxis = axisLeft(yScale) //putting axes label
        yAxis(g.append('g'))  // adds the left axis label
        
        const xAxis = axisTop(xScale)
        xAxis(g.append('g'))

        g.selectAll('rect').data(data)
            .enter().append('rect')
            .attr('x', fish => xScale(fish['Species Name']))
            .attr('y', fish => height - yScale(fish['Calories']))
            .attr('height', fish => yScale(fish['Calories']))
            .transition().duration(2000)
            .delay((d, i) => i * .5)
            .attr('width', xScale.bandwidth())
    }

    async function fetchfishes() {
        // const apiUrl = "https://www.fishwatch.gov/api/species"
        let restResponse = await fetch("https://www.fishwatch.gov/api/species")
        let data = await restResponse.json()
        data.forEach(fish => {
            fishObjectAdder(fish, fishAbundancy)
        })
        render(data) // for graph
        // second function
        console.log(data)
        return data.map(createFish) // will give fish object
        // console.log(fish)
    }
    fishes = await fetchfishes()
    fishes.forEach(renderFish) //render fish with ids
}


function singleFishPage(fish) {
    const container = document.getElementById("single-fish")
    const name = document.getElementById("fish-name")
    const description = document.getElementById("fish-description")
    const image = document.getElementById("single-fish-image")
    const location = document.getElementById('fish-location')
    const locationTitle = document.getElementById("fish-location-title")
    name.innerHTML = fish.name
    location.innerHTML = fish.location

    // fish.location ? locationTitle.innerHTML = "Location"
    locationTitle.innerHTML = fish.location ? "Location" : ""
    image.src = fish.image
    container.className = "visible"
}



function fishObjectAdder(fish, fishAbundancy) {
    let populationSentence = fish.Population
    // console.log(populationSentence)
    let name = fish['Species Name']
    let status;

    if (populationSentence === null) {
        status = "unknown"
    } else if (populationSentence.toLowerCase().includes("significantly below")) {
        status = "significantly below"
    } else if (populationSentence.toLowerCase().includes("significantly above")) {
        status = "significantly above"
    } else if (populationSentence.toLowerCase().includes("above")) {
        status = 'above'
    } else if (populationSentence.toLowerCase().includes("below")) {
        status = "below"
    } else if (populationSentence.toLowerCase().includes("unknown")) {
        status = "unknown"
    } else if (populationSentence.toLowerCase().includes("near target level"))
        status = "near target level"
    else {
        console.log(populationSentence)
    }

    fishAbundancy[name] ||= ''
    fishAbundancy[name] = status
}


function renderFish(fish,index) { //index is used for the html so we can figure out what fish it is when we click on it
    const profile = fishProfileTemplate.content.cloneNode(true).children[0]
    const name = profile.querySelector("[data-SpeciesName]")
    const description = profile.querySelector("[data-physicalDescription]")
    const fishImage = profile.querySelector("[data-image]")

    name.innerHTML = fish.name
    description.innerHTML = fish.description
    // console.log(fishImageAPI)
    fishIcon.insertAdjacentHTML('beforeEnd', `<img data-id="${index}" src=${fish.image}>`)
    fishProfileContainer.append(profile)
    return { name: fish["Species Name"], element: profile }
}

//will take fish object
//will work with a single copy versus our other render fish function

function createFish(fish) {
    let ret = {} //return
    ret.image = fish['Image Gallery'] === null
        ? 'src/image/noFish.jpeg'
        : (fish['Image Gallery']['src'] === undefined ? fish['Image Gallery'][0]['src'] : fish['Image Gallery']['src'])
    ret.name = fish["Species Name"]
    ret.description = fish["Physical Description"]
    ret.location = fish["Location"]
    return ret
}

