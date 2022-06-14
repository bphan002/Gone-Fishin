import { graph } from "./graph"
import {restResponse} from "./data/data.js"


const fishProfileContainer = document.getElementById("fish-profile-container")

let fishToGraph = []
let allFish = []

document.addEventListener("DOMContentLoaded", () => start())

async function start() {
    configLinks()

    fishProfileContainer.addEventListener("click", (e) => {
        const fish = e.target.parentNode
        const id = fish.dataset['id']
        updateFishProfile(allFish[id])
    });

    const searchInput = document.getElementById("search")
    searchInput.addEventListener("input", e => {
        const value = e.target.value.toLowerCase()
        showFishMatch(allFish, value)
    })

    function fakeAPICall() {
        let data = restResponse  //restResponse already parsed
        return data.map(createFish)
    }

    allFish = fakeAPICall()
    allFish.forEach(addFishIcon)
    graph(allFish) //sample graph
}


function updateFishProfile(fish) {
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
    applyButtontext(fish, button)

    button.onclick = () => {
        fish.selected = !fish.selected
        if (fish.selected) {
            fishToGraph.push(fish)
        } else {
            fishToGraph = fishToGraph.filter((ele) => {
                return ele !== fish
            })
        }
        applyButtontext(fish, button)
        graph(fishToGraph)
    }

    changePage("single-fish")

    function applyButtontext(fish, button) {
        if (fish.selected) {
            button.innerHTML = "Remove Fish from Graph"
            button.classList.add("remove-graph")
        } else {
            button.innerHTML = "Add Fish to Graph"
            button.classList.remove("remove-graph")
        }

    }
}

function addFishIcon(fish, index) {
    const fishProfileTemplate = document.getElementById("fish-profile-template")
    const profile = fishProfileTemplate.content.cloneNode(true).children[0]
    const name = profile.querySelector("h3")
    const image = profile.querySelector("img")
    image.src = fish.image
    name.innerHTML = fish.name
    fishProfileContainer.append(profile)
    profile.dataset.id = index
}


function createFish(fish) {
    let fishObj = {}
    fishObj.image = fish["Species Illustration Photo"].src
    fishObj.name = fish["Species Name"]
    fishObj.description = fish["Physical Description"]
    fishObj.location = fish["Location"]
    fishObj.selected = false
    fishObj.calories = fish['Calories']

    let populationSentence = fish.Population
    
    if (populationSentence === null) {
        fishObj.status = "unknown"
        fishObj.color = "black"
    } else if (populationSentence.toLowerCase().includes("significantly below")) {
        fishObj.status = "significantly below"
        fishObj.color = "rgb(115,10,0)"
    } else if (populationSentence.toLowerCase().includes("significantly above")) {
        fishObj.status = "significantly above"
        fishObj.color = "rgb(39,201,37)"

    } else if (populationSentence.toLowerCase().includes("above")) {
        fishObj.status = 'above'
        fishObj.color = "blue"

    } else if (populationSentence.toLowerCase().includes("below")) {
        fishObj.status = "below"
        fishObj.color = "rgb(230,32,0)"
    } else if (populationSentence.toLowerCase().includes("unknown")) {
        fishObj.status = "unknown"
        fishObj.color = "black"
    } else if (populationSentence.toLowerCase().includes("near target level")) {
        fishObj.status = "near target level"
        fishObj.color = "rgb(255,170,1)"
    } 

    return fishObj
}

function showFishMatch(fishes, value) {
    const fishEle = document.querySelectorAll("[data-id]")
    fishEle.forEach(ele => {
        let index = ele.dataset.id
        const isVisible = fishes[index].name.toLowerCase().includes(value)
        ele.classList.toggle("hide", !isVisible)
    })
}

function getPageConfig() {
    return {
        links: document.querySelectorAll("header [data-page]"),
        pages: document.querySelectorAll("main [data-page]")
    }
}

function configLinks() {
    const config = getPageConfig()
    config.links.forEach(link => {
        link.addEventListener('click', () => {
            changePage(link.dataset.page) //sting of the page id
        })
    })
}

function changePage(targetPage) {
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
