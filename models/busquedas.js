import fs from 'fs';
import axios from 'axios';

class Busquedas {

    historial = []; //max 6 busquedas
    dbPath= './db/database.json';

    constructor(){
        //TODO:  Leer bd si existe
        this.leerDB();
    }

    get historialCapitalizado(){
        return this.historial.map( lugar =>{

            let palabras = lugar.split( ' ' ); //quitar espacios
            palabras= palabras.map( p => p[0].toUpperCase() + p.substring(1) );

            return palabras.join(' '); //unir espacios
        })
    }

    get paramsMapBox(){ //metodo para entregar los param de mapbox
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'lenguage': 'es'
        }
    };

    async ciudad( lugar = '' ){
        //petición HTTP 
        try {

            const intance = axios.create({ //crear instancia axios
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapBox
                
            });

            const resp = await intance.get();
            return resp.data.features.map( lugar =>({ //MAP para retornar array con datos necesarios como objeto
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
            }));
            
        } catch (error) {
            return [];
        }
    }

    async climaLugar( lat, lon ){

        try {
            const intance = axios.create({ //crear instancia axios
                baseURL: `https://api.openweathermap.org/data/2.5/weather?lat=${ lat }&lon=${ lon }`,
                params: {
                 appid: process.env.OPENWEATHER_KEY ,   
                 lang: 'es',
                 units: 'metric'
                }
                
            });

            const resp = await intance.get();
            const { weather, main } = resp.data;
            return {
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp
            }


        } catch (error) {
            console.log( error );
        }

    }

    agregarHistorial( lugar= '' ) {
        //Prevenir duplicados
        if ( this.historial.includes( lugar.toLocaleLowerCase() ) ){
            return;
        }
        this.historial= this.historial.splice(0,5); //para mantener 6 busquedas en historial
        this.historial.unshift( lugar.toLocaleLowerCase() ); //se añade al inicio del arreglo
        //grabar BD
        this.guardarDB();
    }


    guardarDB(){
        const payload = {
            historial: this.historial
        };

        fs.writeFileSync(this.dbPath, JSON.stringify( payload ));
    }


    leerDB(){

        if(!fs.existsSync( this.dbPath )){ //si no existe, retorna
            return;
        }
        const info = fs.readFileSync( this.dbPath, { encoding: 'utf-8' } ); //lee el archivo 
        const data = JSON.parse( info ); //lo conviernte a json

        this.historial= data.historial; //lo guarda en el arreglo

    }

}


export {Busquedas};