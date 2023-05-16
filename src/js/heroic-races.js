/*

lapLoad.innerHTML += `
<div class="title-lap-session">
    <span>Volta ${lap.lap} - Sessão ${session.session}</span>
</div>
<div class="sessions" id="session-${session.session}">

</div>
`
session.missions.forEach( (mission) => {
let sessionLoad = lapLoad.querySelector(`#session-${session.session}`)
let itemImgURL = ''
if (mission.name == 'Feed Dragons') {
    mission.name = 'Alimentar Dragões'
    itemImgURL = 'https://cdn.statically.io/img/dc-mapas.com.br/f=webp,w=50,h=50/assets/img/resources/hr/hr-dg-feed.png'
} else if (mission.name == 'Collect Gold') {
    mission.name = 'Coletar Ouro'
    itemImgURL = 'https://cdn.statically.io/img/dc-mapas.com.br/f=webp,w=50,h=50/assets/img/resources/hr/hr-gold.png'
} else if (mission.name == 'Collect Food') {
    mission.name = 'Coletar Comida'
    itemImgURL = 'https://cdn.statically.io/img/dc-mapas.com.br/f=webp,w=50,h=50/assets/img/resources/hr/hr-food.png'
} else if (mission.name == 'League Battles') {
    mission.name = 'Batalhar nas Ligas'
    itemImgURL = 'https://cdn.statically.io/img/dc-mapas.com.br/f=webp,w=50,h=50/assets/img/resources/hr/hr-league.png'
} else if (mission.name == 'Battle Dragons') {
    mission.name = 'Batalhar na Corrida'
    itemImgURL = 'https://cdn.statically.io/img/dc-mapas.com.br/f=webp,w=50,h=50/assets/img/resources/hr/hr-battle.png'
} else if (mission.name == 'Breed Dragons') {
    mission.name = 'Cruzar Dragões'
    itemImgURL = 'https://cdn.statically.io/img/dc-mapas.com.br/f=webp,w=50,h=50/assets/img/resources/hr/hr-breed.png'
} else if (mission.name == 'Hatch Eggs') {
    mission.name = 'Chocar Ovos'
    itemImgURL = 'https://cdn.statically.io/img/dc-mapas.com.br/f=webp,w=50,h=50/assets/img/resources/hr/hr-hatch.png'
}

if (mission.wait_time == null) {
    mission.wait_time = '00:00'
}
if (mission.total_wait_time == null) {
    mission.total_wait_time = '00:00'
}
sessionLoad.innerHTML += `
<div class="missions">
<div class="image">
    <img src="${itemImgURL}" alt="${mission.name}">
</div>
<div class="info">
    <span><b>Missão:</b> ${mission.name}</span>
    <span><b>Precisa:</b> ${mission.total}</span>
    <span><b>Máximo:</b> ${mission.maximum}</span>
    <span><b>Tempo de Espera p/ ítem:</b> ${mission.wait_time}</span>
    <span><b>Tempo de Espera Total:</b> ${mission.total_wait_time}</span>
</div>
</div>
`

*/

const heroicRacesIconsUrl = {
    feed: "https://deetlist.com/dragoncity/img/custom/feed.png",
    food: "https://deetlist.com/dragoncity/img/custom/food.png",
    gold: "https://deetlist.com/dragoncity/img/custom/gold.png",
    battle: "https://deetlist.com/dragoncity/img/custom/fight.png",
    pvp: "https://deetlist.com/dragoncity/img/custom/League.png",
    hatch: "https://deetlist.com/dragoncity/img/custom/hatch.png",
    breed: "https://deetlist.com/dragoncity/img/custom/breed.png"
}

async function getHeroicRacesData() {
    const response = await fetch("https://dck-001-data.onrender.com/islands/heroic_race/")
    const data = await response.json()
    return data
}

async function renderLap(laps, lapNumber) {
    const lapIndex = lapNumber - 1
    const lap = laps[lapIndex]

    html = ""

    for (const node of lap.nodes) {
        html += `<div class="title-lap-node"><span>Lap ${lap.number} - Node ${node.number}</span></div>`
        html += `<div class="node">`

        for (const mission of node.missions) {
            const itemImageUrl = heroicRacesIconsUrl[mission.type]
            html += `<div class="mission"><div class="image"><img src="${itemImageUrl}" alt="${mission.name}"></div><div class="info"><span><b>Task:</b> ${mission.name}</span><span><b>Items:</b> ${mission.goal_items}</span><span><b>Maximum:</b> ${mission.pool_size}</span>`

            if (mission.pool_time.per_item > 0) {
                html += `<span><b>Wait time per item:</b> ${mission.pool_time.per_item}</span><span><b>Wait time total:</b> ${mission.pool_time.total}</span>`
            } else {
                html += "<span><b>Wait time per item:</b> 00:00</span><span><b>Wait time total:</b> 00:00</span>"
            }

            html += "</div></div>"
        }

        html += "</div>"
    }

    document.querySelector("#heroic-races-laps").innerHTML = html
}

(async () => {
    const heroicRacesData = await getHeroicRacesData()
    const laps = heroicRacesData.laps
    const $lapSelector = document.querySelector("#lap-selector")

    for (let i = 1; i <= laps.length; i++) {
        const $option = document.createElement("option")

        $option.textContent = `Lap ${i}`
        $option.value = i

        $lapSelector.appendChild($option)
    }

    $lapSelector.addEventListener("change", async (event) => {
        const lapNumber = Number($lapSelector.value)
        await renderLap(laps, lapNumber)
    })

    console.log(heroicRacesData)
    await renderLap(laps, 1)
})()