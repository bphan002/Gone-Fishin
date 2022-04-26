import {select, scaleBand, scaleLinear, axisLeft, axisTop, axisBottom, scaleExtent } from "d3"

const h1 = select('h1').style('color', 'green')
const fishProfileContainer = document.querySelector("[fish-profile-container]")
const fishProfileTemplate = document.querySelector("[fish-profile-template]")
const search = document.querySelector("[data-search]")
const fishIcon = document.querySelector(".image-container")
let fishAbundancy = {}
let fishes; 



document.addEventListener("DOMContentLoaded",()=> start()) //triggers whole start

async function start() {
     //this is for the search bar filter.  It'll store the filtered fish in an array

    //this grabs a key/value pair of the fish and how abundant it is 

    addLinks()
    //when browser has finish loading....
    //fires when everything is ready when DOM is ready
    //safeguard between trying to access element before domtree has fully loaded
    // put all your dom manipulations here

    //this funciton will be used to redirect to detailed page of a specific fish

    //i want this to listen to a clicked iimage once it is clicked the detailed
    //function will run to change the page to the specific fish deatils 
    fishProfileContainer.addEventListener("click", (e) => {
        const fish = e.target.parentNode
        console.log(fish)
        const id = fish.dataset['id']
        singleFishPage(fishes[id]) //grabs whole fishes array
    });


    //this is for searchbar
    search.addEventListener("input", e => {
        const value = e.target.value.toLowerCase()
        // console.log(fishes)
        searchResult(fishes,value)
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
        data = data.slice(0,20)
        console.log("---",data)
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

        g.selectAll('rect').data(data)
            .enter().append('rect')
            .attr('x', fish => xScale(fish['Species Name']))
            .attr('y', fish => yScale(fish['Calories']))
            .attr('height', fish => graphHeight - yScale(fish['Calories']))
            .style("fill", fish => fishAbundancy[fish['Species Name']].color)
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
    const descriptionTitle = document.getElementById("fish-description-title")
    const description = document.getElementById("fish-description")
    const image = document.getElementById("single-fish-image")
    const location = document.getElementById('fish-location')
    const locationTitle = document.getElementById("fish-location-title")
    name.innerHTML = fish.name
    

    console.log(fish.description)
    // fish.location ? locationTitle.innerHTML = "Location"
    locationTitle.innerHTML = fish.location ? "Location" : ""
    location.innerHTML = fish.location
    descriptionTitle.innerHTML = fish.description ? "Description" : ""
    description.innerHTML = fish.description
    image.src = fish.image
    changePage("single-fish")
}

function fishObjectAdder(fish) {
    let populationSentence = fish.Population
    // console.log(populationSentence)
    let name = fish['Species Name']
    let status;
    let color;

    if (populationSentence === null) {
        status = "unknown"
        color = "black"
    } else if (populationSentence.toLowerCase().includes("significantly below")) {
        status = "significantly below"
        color = "red"
    } else if (populationSentence.toLowerCase().includes("significantly above")) {
        status = "significantly above"
        color = "green"
    } else if (populationSentence.toLowerCase().includes("above")) {
        status = 'above'
        color = "lightgreen"
    } else if (populationSentence.toLowerCase().includes("below")) {
        status = "below"
        color = "orange"
    } else if (populationSentence.toLowerCase().includes("unknown")) {
        status = "unknown"
        color = "black"
    } else if (populationSentence.toLowerCase().includes("near target level")) {
        status = "near target level"
        color = "pink"
    } else {
        console.log(populationSentence)
    }

    fishAbundancy[name] = {status,color}
}


function renderFish(fish,index) { //index is used for the html so we can figure out what fish it is when we click on it
    const profile = fishProfileTemplate.content.cloneNode(true).children[0]
    const name = profile.querySelector("h3")
    const image = profile.querySelector("img")
    image.src = fish.image
    name.innerHTML = fish.name
    fishProfileContainer.append(profile)
    profile.dataset.id = index
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

function searchResult(fishes,value){
    const fishEle= document.querySelectorAll("[data-id]")
    fishEle.forEach(ele => {
        let index = ele.dataset.id
        const isVisible =fishes[index].name.toLowerCase().includes(value)
        ele.classList.toggle("hide", !isVisible)
    })
}

//find all of the nav items that have data attribute data-page
// go through all elements in main that have that tag and create a list
//add event listenrs to each of those
// loop through all of the elements prev stored and hide them unless data matches

function getPageConfig(){
    return {
        links:document.querySelectorAll("nav [data-page]"),
        pages:document.querySelectorAll("main [data-page]")
    }
}

function addLinks() {
    const config = getPageConfig()
    config.links.forEach(link => {
        link.addEventListener('click',()=>{
            changePage(link.dataset.page)
        })
    })
} 

function changePage(targetPage){
    const config = getPageConfig()
    config.pages.forEach(page => {
        if (page.dataset.page === targetPage) {
                page.classList.remove('invisible')
                page.classList.add('visible')
        } else {
                page.classList.add('invisible')
                page.classList.remove('visible')
        }
    })
}