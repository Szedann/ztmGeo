const fetch = require('node-fetch');
const {JSDOM} = require('jsdom')


let key;

const provider = 'https://api.um.warszawa.pl/api/action/dbtimetable_get'

class UM {
    constructor(apiKey){
        this.apiKey = apiKey;
        key = apiKey
    }
    async getLineTimeTable(line){
        const data = await fetch(`https://api.um.warszawa.pl/api/action/dbtimetable_get?id=e923fa0e-d96c-43f9-ae6e-60518c9f3238&busstopId=7009&busstopNr=01&line=${line}&apikey=${key}`).then(res=>res.json())

        console.log(data)

    }
    getGroupByName(name){
        let output;
        fetch(`${provider}?id=b27f4c17-5c50-4a5b-89dd-236b282bc499&name=${encodeURIComponent(name)}&apikey=${key}`).then(res=>res.json()).then(json=>{
            output = new Group(json.result[0].values[0].value, json.result[0].values[1].value)
            return output
        })
    }
    getLine(line){
        return fetch(`https://api.um.warszawa.pl/api/action/busestrams_get/?resource_id=f2e5503e927d-4ad3-9500-4ab9e55deb59&type=1&line=${line}&apikey=${key}`).then(res=>res.json()).then(json=>{
            return json.result
        })
    }
    getBuses(){
        return fetch(`https://api.um.warszawa.pl/api/action/busestrams_get/?resource_id=f2e5503e927d-4ad3-9500-4ab9e55deb59&type=1&apikey=${key}`).then(res=>res.json()).then(json=>{
            return json.result
        })
    }
    async getBusPicture(registrationID){
        const queryHTML = await fetch(`http://wawakom.pl/szukaj/wynikiPojazdy?id_model=null&id_przewoznik=null&rejestracja=${encodeURIComponent(registrationID)}&taborowy=null&opis=null&rokprodukcji=null&rokkasacji=null&roknabycia=null&roksprzedania=null&skasowany=null&sprzedany=null`).then(res=>{return res.text()})
        const queryDOM = new JSDOM(queryHTML)
        const imageFileName = queryDOM.window.document.getElementsByClassName('zdjecie').item(0).children.item(0).alt
        if(imageFileName.toLowerCase() == 'brak zdjęcia') return '/images/1x1.png'
        return 'http://wawakom.pl/Wawakom/web/uploads/photos/'+imageFileName
    }
    async getBusDetails(busID){

        const searchHTML = await fetch(`https://www.ztm.waw.pl/baza-danych-pojazdow/?ztm_traction=1&ztm_vehicle_number=${busID}`).then(res=>{return res.text()})
        const searchDOM = new JSDOM(searchHTML)
        const dbURL = searchDOM.window.document.getElementById('ztm_vehicles_grid').children.item(1).children.item(0).href

        const busHTML = await fetch(dbURL).then(res=>{return res.text()})
        const busDOM = new JSDOM(busHTML)
        const busDetailsElement = busDOM.window.document.getElementsByClassName('vehicle-details').item(0)

        const maker = busDetailsElement.children.item(0).children.item(0).children.item(1).innerHTML
        const model = busDetailsElement.children.item(0).children.item(1).children.item(1).innerHTML
        const year = busDetailsElement.children.item(0).children.item(2).children.item(1).innerHTML

        const registrationID = busDetailsElement.children.item(1).children.item(1).children.item(1).innerHTML
        const vehicleID = busDetailsElement.children.item(1).children.item(2).children.item(1).innerHTML

        const carrier = busDetailsElement.children.item(2).children.item(0).children.item(1).innerHTML
        const depot = busDetailsElement.children.item(2).children.item(1).children.item(1).innerHTML

        const ticketMachine = busDetailsElement.children.item(3).children.item(0).children.item(1).innerHTML
        const equipment = busDetailsElement.children.item(3).children.item(1).children.item(1).innerHTML.split(', ')

        const returnData = {maker, model, year, registrationID, vehicleID, carrier, depot, ticketMachine, equipment}
        
        return returnData
    }
}

class Group {
    constructor(id, name){
        this.id = id;
        this.name = name;
    }
    getStops(){
        return fetch(`https://api.um.warszawa.pl/api/action/dbstore_get?id=ab75c33d-3a26-4342-b36a-6e5fef0a3ac3&apikey=${key}&busstopId=${this.id}`).then(res=>res.json()).then(json=>{

            console.log(json.result)

            // let array = json.result
            // let res = [];
            // console.log(array)

            // for(let i = 0; i < array.length; i++){
            //     let el = array[i];
            //     res[i] = new Stop(el.values[0].value, el.values[1].value, el.values[3].value, el.values[4].value, el.values[5].value, el.values[6].value, el.values[7].value);
            // }
            // return res;
            
        })
    }
}

class Stop {
    constructor(group, nr, street, latitude, longitude, direction, from){
        this.group = group,
        this.nr = nr,
        this.street = street,
        this.latitude = latitude,
        this.longitude = longitude,
        this.direction = direction,
        this.from = from
    }
    getLines(){
        return fetch(`${provider}?id=88cd555f-6f31-43ca-9de4-66c479ad5942&busstopId=${this.group}&busstopNr=${this.nr}&apikey=${key}`).then(res=>res.json()).then(json=>{
            let array = json.result
            let res = {
                symbol_1: array[0].values[0].value.values[0].value,
                symbol_2: array[0].values[0].value.values[1].value,
                symbol_3: array[0].values[0].value.values[2].value,
                direction: array[0].values[0].value.values[2].value,
            }
            for(let i = 0; i < array.length; i++){
                res.dynamic[i].time = array[i].values[0].value.values[5].value
                res.dynamic[i].brigade = array[i].values[0].value.values[2].value
            }
            return res;
        })
    }
    getTimeTable(line){
        if(line){
            return fetch(`${provider}?id=e923fa0e-d96c-43f9-ae6e-60518c9f3238&busstopId=${this.group}&busstopNr=${this.nr}&line=${line}&apikey=${key}`).then(res=>res.json()).then(json=>{
                json.result.forEach(element => {
                    console.log(element)
                });
            })
        }       

    }
}

class Line {
    constructor(line){
        this.line = line,
        fetch(`${provider}?id=e923fa0e-d96c-43f9-ae6e-60518c9f3238&busstopId=7009&busstopNr=01&line=523&apikey=${key}`)
    }
}

module.exports = {UM, key};