import { graph } from "./graph"
import { createFish, updateFishProfile, addFishIcon} from "./fish"

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
        showFishMatches(allFish, value)
    })

    async function fetchFishes() {
        let restResponse = await fetch("https://www.fishwatch.gov/api/species")
        let data = await restResponse.json()
        return data.map(createFish)
    }

    allFish = await fetchFishes()
    allFish.forEach(addFishIcon)
    graph(allFish) //sample graph
}






function showFishMatches(fishes, value) {
    const fishEle = document.querySelectorAll("[data-id]")
    fishEle.forEach(ele => {
        let index = ele.dataset.id
        const isVisible = fishes[index].name.toLowerCase().includes(value)
        ele.classList.toggle("hide", !isVisible)
    })

}

//find all of the nav items that have data attribute data-page
// go through all elements in main that have that tag and create a list
//add event listenrs to each of those
// loop through all of the elements prev stored and hide them unless data matches

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


