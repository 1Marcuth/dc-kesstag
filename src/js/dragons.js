async function getDragonsData() {
    const response = await fetch("https://dck-001-data.onrender.com/items/dragons/all/basic_info/")
    const data = await response.json()
    return data
}

async function renderDragonCards(dragonsData) {
    let html = "<ul>"

    for (const dragonData of dragonsData.slice(0, 20)) {
        html += `<a target="_blank" href="${dragonData.page_url}"><li class="dragon-card card w-75 mb-3">`

        html += `<div class="card-body">
            <h5 class="card-name">${dragonData.name}</h5>
            <img src="${dragonData.img_url}" alt="${dragonData.name} image">
            <br>
            <a href="${dragonData.page_url}" class="btn btn-primary">Show more informations</a>
        </div>`

        html += "</li></a>"
    }

    html += "</ul>"

    document.querySelector("#dragons-container").innerHTML = html
}

function filterDragons(dragonData, inputValue) {
    const filteredDragons = dragonData.filter(dragonData => {
        const dragonNameParsed = dragonData.name.toLowerCase()
        const inputValueParsed = inputValue.toLowerCase().trim()

        return dragonNameParsed.includes(inputValueParsed)
    })

    return filteredDragons
}

async function createDragonsPagination(dragonsData) {
    const dragonsPerPage = 15
    const totalOfPages = Math.ceil(dragonsData.length / dragonsPerPage)

    const $dragonPageButtons = document.querySelector("#dragon-page-buttons")

    $dragonPageButtons.innerHTML = ""

    for (let pageIndex = 0; pageIndex < (totalOfPages - 1); pageIndex++) {
        const $button = document.createElement("button")

        $button.id = `page-index-${pageIndex}`
        $button.classList.add("btn")
        $button.classList.add("btn-primary")
        $button.textContent = `${pageIndex + 1}`
        $button.addEventListener("click", async (event) => {
            const selectedPageIndex = Number(event.target.id.replace("page-index-", ""))
            const selectedDragonsStartIndex = selectedPageIndex * dragonsPerPage
            const selectedDragonsEndIndex = selectedDragonsStartIndex + dragonsPerPage
            const selectedDragons = dragonsData.slice(selectedDragonsStartIndex, selectedDragonsEndIndex)

            await renderDragonCards(selectedDragons)
        })

        $dragonPageButtons.appendChild($button)
    }

    await renderDragonCards(dragonsData.slice(0, dragonsPerPage))
}

(async () => {
    const $dragonNameSearch = document.querySelector("#dragon-name-search")

    const dragonsData = await getDragonsData()

    await createDragonsPagination(dragonsData)

    $dragonNameSearch.addEventListener("input", async (event) => {
        const inputValue = $dragonNameSearch.value
        const newDragons = filterDragons(dragonsData, inputValue)
        await createDragonsPagination(newDragons)
    })
})()