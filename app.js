import * as dotenv from 'dotenv';
dotenv.config();

import { inquirerMenu, leerInput, listarLugares, pausa } from "./helpers/inquirer.js"
import {Busquedas} from "./models/busquedas.js";


const main = async() => {

    const busquedas = new Busquedas();

   //menu principal
   let opt;
   
    do {
        opt = await inquirerMenu();
        
        switch (opt) {
            case 1:
                //mostrar msg usuario
                const termino = await leerInput('Ciudad: ');
                
                //buscar lugares
                const lugares= await busquedas.ciudad( termino );
                
                //seleccionar  lugar
                const id = await listarLugares( lugares ); //desde array hacia el inquirer
                if( id === '0' ) continue;
                const lugarSel = lugares.find( l => l.id === id); //busco por id en el Array
                
                //guardar en DB
                busquedas.agregarHistorial( lugarSel.nombre );
                
                //datos clima
                const clima = await busquedas.climaLugar( lugarSel.lat, lugarSel.lng );
           

                //mostrar resultados
                console.clear();
                console.log('\n Información de la ciudad: \n'.green  );
                console.log('Ciudad: ', lugarSel.nombre.green );
                console.log('Lat: ', lugarSel.lat  );
                console.log('Lng: ', lugarSel.lng  );
                console.log('Temperatura: ', clima.temp  );
                console.log('Mínima ', clima.min  );
                console.log('Máxima: ', clima.max);
                console.log('Descripción: ', clima.desc.green );
                break;
        
            case 2:
                busquedas.historialCapitalizado.forEach( ( lugar, i )=>{
                    const idx = `${ i+1 }.`.green;
                    console.log( `${ idx } ${ lugar }` );
                })
                break;

            case 0:
                break;
        }

      if( opt !== 0 )  await pausa();// pausa para hacer preguntas al usuario

    } while (opt !== 0);

}

main();