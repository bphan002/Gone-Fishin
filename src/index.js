document.addEventListener("DOMContentLoaded", () => {
//when browser has finish loading....
    //fires when everything is ready when DOM is ready
    //safeguard between trying to access element before domtree has fully loaded
    // put all your dom manipulations here

    const h1 =d3.select('h1').style('color', 'green')
    const fishProfileContainer = document.querySelector("[fish-profile-container]")
    const fishProfileTemplate = document.querySelector("[fish-profile-template]")
    const search = document.querySelector("[data-search]")

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


    async function fetchFishes() {
        // const apiUrl = "https://www.fishwatch.gov/api/species"
        fetch("https://www.fishwatch.gov/api/species")
        .then ((resp) => {
            return resp.json()
        })
        .then(data => {
            //first function
                

            //second function
            // console.log(data)
            fishes = data.map(fish => {

                console.log(fish)

                
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