const app = require('./app');

const port = 8000;


app.set('port', process.env.PORT ?? port);

module.exports = ()=>{

    const server = app.listen(app.get('port'), ()=>{
        console.log(`Listening on port ${server.address().port}`);
    })

}