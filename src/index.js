import {render} from "./graph"

const fishProfileContainer = document.querySelector("[fish-profile-container]")
const fishProfileTemplate = document.querySelector("[fish-profile-template]")
const search = document.querySelector("[data-search]")
const fishIcon = document.querySelector(".image-container")
let fishGraph = []

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
 
    async function fetchfishes() {
        // const apiUrl = "https://www.fishwatch.gov/api/species"
        let restResponse = await fetch("https://www.fishwatch.gov/api/species")
        let data = await restResponse.json()
    
        // second function
        console.log(data)
        return data.map(createFish) // will give fish object
        // console.log(fish)
    }
    fishes = await fetchfishes()
    fishes = fishes.filter(fish => fish.image)
    fishes.forEach(renderFish) //render fish with ids
    render(fishes) // for graph
}


function singleFishPage(fish) {
    const container = document.getElementById("single-fish")
    const name = document.getElementById("fish-name")
    const descriptionTitle = document.getElementById("fish-description-title")
    const description = document.getElementById("fish-description")
    const image = document.getElementById("single-fish-image")
    const location = document.getElementById('fish-location')
    const locationTitle = document.getElementById("fish-location-title")
    const button = container.querySelector('button')
    
    name.innerHTML = fish.name
    locationTitle.innerHTML = fish.location ? "Location" : ""
    location.innerHTML = fish.location
    descriptionTitle.innerHTML = fish.description ? "Description" : ""
    description.innerHTML = fish.description
    image.src = fish.image
    applyButtontext(fish,button)

    button.onclick = () => {   
        fish.selected = !fish.selected
        if (fish.selected) {
            fishGraph.push(fish)
        } else {
            fishGraph = fishGraph.filter((ele) => {
                return ele !== fish 
            })
        }
        applyButtontext(fish,button)
        render(fishGraph)
    }

    function applyButtontext(fish,button) {
        if (fish.selected) {
            button.innerHTML = "Remove Fish from Graph"
            button.classList.add("remove-graph")
        } else {
            button.innerHTML = "Add Fish to Graph"
            button.classList.remove("remove-graph")
        }
        
    }

    changePage("single-fish")
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
    ret.image = fish["Species Illustration Photo"].src 
    ret.name = fish["Species Name"]
    ret.description = fish["Physical Description"]
    ret.location = fish["Location"]
    ret.selected = false
    ret.calories = fish['Calories']

    let populationSentence = fish.Population
    // console.log(populationSentence)
    if (populationSentence === null) {
        ret.status = "unknown"
        ret.color = "black"
    } else if (populationSentence.toLowerCase().includes("significantly below")) {
        ret.status = "significantly below"
        ret.color = "red"
    } else if (populationSentence.toLowerCase().includes("significantly above")) {
        ret.status = "significantly above"
        ret.color = "green"
    } else if (populationSentence.toLowerCase().includes("above")) {
        ret.status = 'above'
        ret.color = "lightgreen"
    } else if (populationSentence.toLowerCase().includes("below")) {
        ret.status = "below"
        ret.color = "orange"
    } else if (populationSentence.toLowerCase().includes("unknown")) {
        ret.status = "unknown"
        ret.color = "black"
    } else if (populationSentence.toLowerCase().includes("near target level")) {
        ret.status = "near target level"
        ret.color = "pink"
    } else {
        console.log(populationSentence)
    }

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
        links:document.querySelectorAll("header [data-page]"),
        pages:document.querySelectorAll("main [data-page]")
    }
}

function addLinks() {
    const config = getPageConfig()
    console.log(config)
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