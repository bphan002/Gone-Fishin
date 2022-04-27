
export function createFish(fish) {
    let fishObj = {}
    fishObj.image = fish["Species Illustration Photo"].src
    fishObj.name = fish["Species Name"]
    fishObj.description = fish["Physical Description"]
    fishObj.location = fish["Location"]
    fishObj.selected = false
    fishObj.calories = fish['Calories']

    let populationSentence = fish.Population
    // console.log(populationSentence)
    if (populationSentence === null) {
        fishObj.status = "unknown"
        fishObj.color = "black"
    } else if (populationSentence.toLowerCase().includes("significantly below")) {
        fishObj.status = "significantly below"
        fishObj.color = "red"
    } else if (populationSentence.toLowerCase().includes("significantly above")) {
        fishObj.status = "significantly above"
        fishObj.color = "green"
    } else if (populationSentence.toLowerCase().includes("above")) {
        fishObj.status = 'above'
        fishObj.color = "lightgreen"
    } else if (populationSentence.toLowerCase().includes("below")) {
        fishObj.status = "below"
        fishObj.color = "orange"
    } else if (populationSentence.toLowerCase().includes("unknown")) {
        fishObj.status = "unknown"
        fishObj.color = "black"
    } else if (populationSentence.toLowerCase().includes("near target level")) {
        fishObj.status = "near target level"
        fishObj.color = "pink"
    } else {
        console.log(populationSentence)
    }

    return fishObj
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

