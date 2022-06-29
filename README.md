# [Gone-Fishin Live Website Vesion](https://bphan002.github.io/Gone-Fishin/)

### <u>Description</u>
 This app features the ability to dynamically create a bar graph that shows a fish's calories and the health of a species population by the bar color. An example of a graph can be viewed by clicking on the Fish Graph button.

![Fish Graph Header](header.png)


The maximum fish you can add to a graph for desktop,tablet,mobile is 20,10, and 3 respectively.

 ![Graph Sample](chart-sample.png)
 _Sample of Desktop Image_


### <u>Instructions</u>
1. To create a graph you need to add a fish. You can find a fish by scrolling through the fish tiles or narrow it down with the search bar

2. Next click on the image, which will take you to a details page for that fish

3. Click the "Add Fish to Graph" button

4. From the same position you can deselect a fish from appearing on the graph by clicking on the remove fish from graph button
5. To reset the graph you can reload the page

### <u>Library</u>

* D3.js

### <u>API</u>
* API www.fishwatch.gov


### <u>Technical Implementation details</u>
Search would filter dynamically by getting the user's input and then using the showFishMatch function.
```javascript
let allFish = []
const searchInput = document.getElementById("search")
searchInput.addEventListener("input", e => {
    const value = e.target.value.toLowerCase()
    showFishMatch(allFish, value)
    })
```

The showFishMatch function grabs all of the fish from the API and then iterates through each one to toggle a class for that fish to be invisible/visible depending on the user value typed.

```javascript
function showFishMatch(fishes, value) {
    const fishEle = document.querySelectorAll("[data-id]")
    fishEle.forEach(ele => {
        let index = ele.dataset.id
        const isVisible = fishes[index].name.toLowerCase().includes(value)
        ele.classList.toggle("hide", !isVisible)
    })
}
```


### <u>Future Features</u>
 * Ability to save graphs
 * Filter fish based on population, calories, alphabetically
 * Graph more datapoints (mercury level, yearly population health, season)
 * Ability to print different graph styles