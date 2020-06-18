document.addEventListener("DOMContentLoaded", (event) => {
    console.log('DOM fully loaded and parsed')

    getBikeTrailData(1)
    getBikeTrailData(2)
    getBikeTrailData(3)
    getBikeTrailData(4)
    getBikeTrailData(5)
    getBikeTrailData(6)
    getBikeTrailData(7)
    getBikeTrailData(8)
    getBikeTrailData(9)
    getBikeTrailData(10)
    getMessage()
})

// MAP
let mymap = L.map('mapid').setView([47.6062, -122.3321], 12);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1Ijoiam9obnJ1c2NoIiwiYSI6ImNrYml1eGF5bjBqMzkydnFueGdmbzZkNjcifQ.BSK5zVzCjjSKDKDSb1xcnA'
}).addTo(mymap);

var marker = L.marker([47.571360, -122.349406]).addTo(mymap);
marker.bindPopup("<b>Hello world!</b><br>I am a popup.");
    
// WEATHER
function drawWeather( d ) {
	var celcius = Math.round(parseFloat(d.main.temp)-273.15);
	var fahrenheit = Math.round(((parseFloat(d.main.temp)-273.15)*1.8)+32); 
	var description = d.weather[0].description;
	
	document.getElementById('description').innerHTML = description;
	document.getElementById('temp').innerHTML = fahrenheit + '&deg;';
	document.getElementById('location').innerHTML = d.name;
	
	if( description.indexOf('rain') > 0 ) {
  	document.querySelector(".weather").className = 'rainy';
  } else if( description.indexOf('cloud') > 0 ) {
  	document.querySelector("#weather").className = 'cloudy';
  } else if( description.indexOf('sunny') > 0 ) {
  	document.querySelector(".weather").className = 'sunny';
  }
}

function weatherBalloon() {
    var key = '0adec15f5303cb5a41696c127460d8f9';
    fetch('https://api.openweathermap.org/data/2.5/weather?q=Seattle&appid=' + key)  
    .then(function(resp) { return resp.json() }) // Convert data to json
    .then(function(data) {
        drawWeather(data);
    })
    .catch(function() {
        // catch any errors
    });
}

window.onload = function() {
    weatherBalloon( "Seattle,WA" );
}


//MESSAGES
// const msgContainer = document.querySelector("#messages")
const msgTabs = document.querySelector("#associated-trails")
const msgSection = document.querySelector("#messages")
// const messages = document.querySelector(".messages")
const form = document.querySelector(".message-form")


// document.addEventListener("DOMContentLoaded", (event) => {
//     console.log('DOM fully loaded and parsed')
//     getBikeTrailData(2)
//     getMessage()
// })


function getMessage(){
    fetch("http://localhost:3000/messages")
    .then(resp => resp.json())
    .then(json => 
        json.forEach(message => renderMessage(message))
        )
}

function renderMessage(message){
    const cardBlock = document.querySelector(".card-block")
    // const cardBlock = document.createElement("div")
    // cardBlock.className = "card-block"
    
    const card = document.createElement("div")
    card.className = "card"
    // card.className = `msg-${message.bike_trail_id}`
    card.id = `msg-${message.bike_trail_id}`
    card.style.display = "none"
    
    const row = document.createElement("div")
    row.className = "row"
    
    const userCol = document.createElement("div")
    userCol.className = "col-sm-4"
    userCol.innerText = message.user_name
    
    const msgCol = document.createElement("div")
    msgCol.className = "col-sm-6"
    msgCol.innerText = message.content

    
    row.append(userCol, msgCol)
    card.appendChild(row)
    cardBlock.appendChild(card)
    // console.log(cardBlock)

    // const div = document.createElement("div")
    // div.className = "row"
    // div.hidden = true

    // const userCol = document.querySelector(".col-sm-4")
    // const cardText = document.querySelector(".card-text")
    // // div.id = `message.bike_trail_id`
    
    // const user_name = document.createElement("li")
    // user_name.innerText = message.user_name

    // const msg = document.createElement("p")
    // msg.innerText = message.content

    // // const bikeTrail = document.createElement("li")
    // // bikeTrail.id = message.bike_trail_id
    // // bikeTrail.innerText = message.bike_trail.name
    // // bikeTrailListener(bikeTrail, div)

    // userCol.appendChild(user_name)
    // cardText.appendChild(msg)
    
    // msgSection.appendChild(messages)
    // div.append(user_name, msg)
    // row.appendChild(div)

    // messages.appendChild(div)
    // msgTabs.append(bikeTrail)
}

// function bikeTrailListener(bikeTrail, div) {
//     bikeTrail.addEventListener("click", (e) => {
//         const cards = document.querySelectorAll(".msgCard")
//         cards.forEach(card => card.hidden = true)
//         div.hidden = false

//         const hiddenInput = document.querySelector(".message-form").childNodes[1]
//         const trailInput = document.createElement("input")
//         trailInput.type="hidden"
//         trailInput.id= `${bikeTrail.id}`
//         trailInput.name= `${bikeTrail.id}`
//         form.replaceChild(trailInput, hiddenInput)
//         addMessage(bikeTrail)
//     })
// }

function addMessage(item){
    const userInput = document.querySelector(".user_name-input")
    const msgInput = document.querySelector(".message-input")
    const postBtn = document.querySelector(".message-button")
    const newUser = document.createElement("p")
    const newMsg = document.createElement("p")
    const newTrail = parseInt(`${item.id}`)

    postBtn.addEventListener("click", (e) => {
        e.preventDefault()

        const messages = document.querySelectorAll(`#msg-${e.target.id}`)
        messages.forEach( message => {
            message.style.display = "block"
        })

        newUser.innerText = userInput.value
        userInput.value = ""
        newMsg.innerText = msgInput.value
        msgInput.value = ""
        postMessage(newUser, newMsg, newTrail)
    })
}

function postMessage(newUser, newMsg, newTrail){
    fetch("http://localhost:3000/messages", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json "
        },
        body: JSON.stringify({
            "user_name": newUser.innerText,
            "content": newMsg.innerText,
            "bike_trail_id": newTrail
        })
    })
    .then(resp => resp.json())
    .then(json => renderMessage(json))
}

// TRAIL DATA
const trailData = document.querySelector("#trail-data")
const pathSelector = document.querySelector("#path-selector")
const trailInfo = document.querySelector("#trail-info")

// fetch bike trail data
function getBikeTrailData(bikeTrailId) {
    fetch("http://localhost:3000/bike_trails/" + bikeTrailId)
    .then(resp => resp.json())
    .then(json => renderBikeTrailData(json)) 
}
// format it, hide it
function renderBikeTrailData(data) {
    const trailName = data["data"]["attributes"]["name"]
    const trailDistance = data["data"]["attributes"]["distance"]
    const trailType = data["data"]["attributes"]["trail_type"]
    const trailCard = document.createElement("div")
    trailCard.id = ``
    // trailCard.className = "card"
    trailCard.id = `card-${data["data"]["id"]}`
    const innerTrailInfo = document.createElement("div")


    const trailHeader = document.createElement("h2")
    trailHeader.innerText = `${trailName}`
    trailHeader.className = `${data["data"]["id"]}`

    const trailInfoDistance = document.createElement("div")
    trailInfoDistance.className = "col-sm-6"
    trailInfoDistance.innerText = `Distance: ${trailDistance} Miles`
    const trailInfoType = document.createElement("div")
    trailInfoType.className = "col-sm-6"
    trailInfoType.innerText = `Type ${trailType}`
    trailCard.style.display = "none"
    innerTrailInfo.append(trailInfoDistance, trailInfoType)
    trailCard.appendChild(trailHeader)
    trailCard.appendChild(innerTrailInfo)
    trailInfo.appendChild(trailCard)
    

    const trailNameDropdown = document.createElement("li")
    trailNameDropdown.innerText = trailName 
    trailNameDropdown.id = `${data["data"]["id"]}`
    addListenerToDropdownItem(trailNameDropdown)
    pathSelector.appendChild(trailNameDropdown)

    // CHART
    const chartContainer = document.createElement("div")
    chartContainer.style = "height: 290px; width: 90%; right: 40px; position: absolute;"
    chartContainer.id = `chartContainer-${data["data"]["id"]}`
    trailData.appendChild(chartContainer)
    let trailDataPoints = []
    data["included"].forEach(point => {
        // let fullDt = point["attributes"]["date_time"]
        // if (fullDt != undefined) {
        let dataObj = { 
            // label: (fullDt.charAt(05) + fullDt.charAt(06) + "/" + fullDt.charAt(8) + fullDt.charAt(9)),
            label: point["attributes"]["date_time"],
            y: point["attributes"]["total_trips"]
        }
        trailDataPoints.push(dataObj)
        // }
    })
    const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
      let dateTime = (`${data["included"][0]["attributes"]["date_time"]})`)
      let yearMonth = dateTime.split("-",2)
      let year = yearMonth[0]
      let month = parseInt(yearMonth[1])
      let monthValue = (monthNames[month - 1])

    let chart = new CanvasJS.Chart(`chartContainer-${data["data"]["id"]}`, {
        theme: "light2",
		title:{
			text: `${monthValue} ${year} Traffic`               
		},
		data: [              
		{
			// Change type to "doughnut", "line", "splineArea", etc.
			type: "line",
			dataPoints: trailDataPoints
		}
        ],
            axisX:{
                crosshair: {
                enabled: true,      
                labelFormatter: e => { return ""}
              },
              gridThickness: 0,
              tickLength: 0,
              lineThickness: 0,
              labelFontColor: "transparent"
            }
    });
    chart.render();
    chartContainer.style.display = "none";




    const latitude = parseInt(data["data"]["attributes"]["locations"][0]["latitude"])
    const longitude = parseInt(data["data"]["attributes"]["locations"][0]["latitude"])
    // mymap.setView([longitude, latitude], 13);

    // let marker = L.marker([longitude, latitude]).addTo(mymap)
    // marker.bindPopup("<b>Hello world!</b><br>I am a popup.");





}
// make it identifiable so that when you select a trail it can appear



// BIKE PATH LISTENERS AND SELECTORS
// const pathDropdown = document.querySelector("#path-selector")


function addListenerToDropdownItem(item) {
    item.addEventListener("click", (e) => {
        
        let infoChildren = trailInfo.children;
        for (let i = 0; i < infoChildren.length; i++) {
            let tableChild = infoChildren[i];
            tableChild.style.display = "none"
        }
        let chartChildren = trailData.children;
        for (let i = 0; i < chartChildren.length; i++) {
            let tableChild = chartChildren[i];
            tableChild.style.display = "none"
        }

        const cardBlock = document.querySelector(".card-block")
        let messageChildren = cardBlock.children;
        for (let i=0; i < messageChildren.length; i++) {
            let messageChild = messageChildren[i];
            messageChild.style.display = "none"
        }
        // let messages = document.querySelectorAll(".card")
        // messages.forEach(card => {
        //     card.style.display = "none"
        // })
      
        // trailInfo.children.style.display = "none";
        // trailData.children.style.display = "none";
        const card = document.getElementById(`card-${e.target.id}`)
        card.style.display = "block"
        const chart = document.getElementById(`chartContainer-${e.target.id}`)
        chart.style.display = "block";

        const trailMessages = document.querySelectorAll(`#msg-${e.target.id}`)
        trailMessages.forEach( message => {
            message.style.display = "block"
        })

        const hiddenInput = document.querySelector(".message-form").childNodes[1]
        const trailInput = document.createElement("input")
        trailInput.type="hidden"
        trailInput.id= `${item.id}`
        // trailInput.name= `${item.id}`
        form.replaceChild(trailInput, hiddenInput)
        addMessage(item)
        });
    }
