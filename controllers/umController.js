require('dotenv').config()
const {UM} = require('../um-wwa/um')

const ztm = new UM(process.env.TOKEN)

exports.busesGeo = (req, res)=>{

    if(req.query.line){
        ztm.getLine(req.query.line).then(resp=>res.send(resp))
        return
    }

    ztm.getBuses().then(resp=>res.send(resp))
}

exports.lineInfo = async (req, res)=>{
    ztm.getLineTimeTable(req.query.line)
}

exports.getBusDetails = async (req, res)=>{
    if(!req.query.busID) return res.end('Error: busID parameter is required')
    const busDetails = await ztm.getBusDetails(req.query.busID)
    res.json(busDetails)
}

exports.getBusPhoto = async (req, res)=>{
    if(!req.query.registrationID) return res.end('Error: registrationID parameter is required')
    const imageURL = await ztm.getBusPicture(req.query.registrationID)
    res.redirect(imageURL)
}