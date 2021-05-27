mapboxgl.accessToken = 'pk.eyJ1Ijoic3plZGFubiIsImEiOiJja214YWxtczIwbGl5MnBwZnhtaXR2bTVsIn0.HHNsdy_93e7bHl9yN2k_jg';
var map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/mapbox/streets-v11',
center: [21, 52.23],
zoom: 10
});

function round(number, length){
    return Math.round(number*(10 ** length)) / (10 ** length)
}

function zoomOnPos(lat ,lon){
    map.easeTo({center: [lon, lat], zoom: 16, duration: 2000})
}

function hideResults(){
    const resDiv = document.getElementById('results')
    const button = document.getElementById('show-hide')
    resDiv.style.display = 'none'
    button.parentElement.setAttribute('onclick', 'showResults()')
    button.style.transform = 'rotate(180deg)'
}

function showResults(){
    const resDiv = document.getElementById('results')
    const button = document.getElementById('show-hide')
    resDiv.style.display = 'flex'
    button.parentElement.setAttribute('onclick', 'hideResults()')
    button.style.transform = 'rotate(0deg)'
}

function placeOnMap(json, map){

    document.getElementById('amountOfResults').innerHTML = `Liczba rezultatów: <b>${json.length}</b>`

    if(map.getLayer('points')!=undefined){
        map.removeLayer('points')
        map.removeSource('points')
    }

    features = []
    const outDiv =  document.getElementById('results')
    outDiv.innerHTML = ''
    for(element of json){
        const div = document.createElement('div')
        div.setAttribute('onclick', `zoomOnPos(${element.Lat},${element.Lon}); showBusDetails('${element.VehicleNumber}', ${JSON.stringify(element)});`)
        div.innerHTML = `
        <h2>${element.Lines}</h2>
        <div>Nr. autobusu: <b>${element.VehicleNumber}</b><br>Lokalizacja: <b>${round(element.Lat, 3)}, ${round(element.Lon, 3)}</b></div>
        `
        outDiv.appendChild(div)
        features.push(
            {
                // feature for Mapbox DC
                'type': 'Feature',
                'geometry': {
                'type': 'Point',
                'coordinates': [element.Lon, element.Lat]
                },
                'properties': {
                'title': element.Lines
                }
            }
        )
    };

    

    map.addSource('points', {
        
        'type': 'geojson',
        'data': {
            'type': 'FeatureCollection',
            'features': features
        }
    });



    map.addLayer({
        'id': 'points',
        'type': 'symbol',
        'source': 'points',
        'layout': {
            'text-field': ['get', 'title'],
            'text-font': [
            'Open Sans Regular',
            'Arial Unicode MS Bold'
            ],
            'text-offset': [0, 0],
            'text-anchor': 'center'
            }
    });
}

function getAll(){
    fetch('/geo').then(res=>res.json()).then(json=>placeOnMap(json, map))
}

async function showBusDetails(vehicleID, info){

    const busInfoDiv = document.getElementById('busInfo')
    busInfoDiv.style.display = 'block';
    busInfoDiv.innerHTML = '<span>Wczytywanie...</span>'
    const details = await fetch(`/busDetails?busID=${vehicleID}`).then(res=>{return res.json()})
    busInfoDiv.innerHTML = `
    <h2 style="background-image: url('/busPicture?registrationID=${encodeURIComponent(details.registrationID)}')" >${details.vehicleID}</h2> <br>
    <p>
    Linia: <b>${info.Lines}</b> <br>
    Producent: <b>${details.maker}</b> <br>
    Model: <b>${details.model}</b> <br>
    Rok produkcj: <b>${details.year}</b> <br>
    Nr. rejestracyjny: <b>${details.registrationID}</b> <br>
    Nr. autobusu: <b>${details.vehicleID}</b> <br>
    Przewoźnik: <b id="bus-detail-carrier"></b> <br>
    Zajezdnia: <b>${details.depot}</b> <br>
    Biletomat: <b>${details.ticketMachine}</b> <br>
    Wyposażenie: <b> <ul id="bus-detail-equipment"></ul></b> <br>
    <!-- <a href="https://google.com/maps/place/${info.Lat},${info.Lon}" target="_blank"><i class="fas fa-map-marked-alt"></i>Lokalizacja w Google Maps</a> --!>
    </p>
    `
    console.log(details)
    switch(details.carrier){
        case "Miejskie Zakłady Autobusowe Sp. z o.o.": {
            document.getElementById('bus-detail-carrier').innerHTML = 'MZA'
            break;
        }
        case "Arriva Bus Transport Polska Sp. z o.o.": {
            document.getElementById('bus-detail-carrier').innerHTML = 'MZA'
            break;
        }
        case "Mobilis Sp. z o.o.": {
            document.getElementById('bus-detail-carrier').innerHTML = 'Mobilis'
            break;
        }
        default: {
            document.getElementById('bus-detail-carrier').innerHTML = details.carrier
        }
    }

    for(element of details.equipment){
        document.getElementById('bus-detail-equipment').innerHTML += `<li>${element}</li>`
    }
}

map.on('load', ()=>{
    getAll()
})

addEventListener('keyup', (event)=>{
    if(event.key == "Enter" && document.activeElement.id == "line"){
        getLine()
    }
})

function getLine(){
    const line = document.getElementById("line").value
    document.getElementById('line').value = ''
    fetch(`/geo?line=${line}`).then(res=>res.json()).then(json=>placeOnMap(json, map))
}
