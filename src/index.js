import {render} from "./graph"

const fishProfileContainer = document.querySelector("[fish-profile-container]")
const fishProfileTemplate = document.querySelector("[fish-profile-template]")
const search = document.querySelector("[data-search]")

let fishGraph = []
let fishes; 

document.addEventListener("DOMContentLoaded",()=> start())

async function start() {
    addLinks()

    fishProfileContainer.addEventListener("click", (e) => {
        const fish = e.target.parentNode
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
        let restResponse = await fetch("https://www.fishwatch.gov/api/species")
        let data = await restResponse.json()
    
        return data.map(createFish)  //map will use createFish to make an object with fish parameters from api data
        //data is an array of object with fish properties
    }

    fishes = await fetchfishes() //same as above
    fishes = fishes.filter(fish => fish.image) //don't need this anymore
    fishes.forEach(renderFish) //render fish with ids and these are the icons we set ask about children
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
    const profile = fishProfileTemplate.content.cloneNode(true).children[0] //difference between this and append?
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
    let ret = {} 
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
        links: document.querySelectorAll("header [data-page]"),
        pages: document.querySelectorAll("main [data-page]")
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