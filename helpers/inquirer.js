//const inquirer = require('inquirer'); //paquete para trabajar por consola
import inquirer from 'inquirer'; //paquete para trabajar por consola
import colors from 'colors';

const preguntas = [ //arr menu principal
    {
        type: 'list',
        name: 'opcion',
        message: '¿Qué desea hacer?',
        choices: [
            {
                value: 1,
                name: `${'1'.green}. Buscar ciudad`
            },

            {
                value: 2,
                name: `${'2'.green}. Historial`
            },

            {
                value: 0,
                name: `${'0'.green}. SALIR`
            },
        ]
    }
];



const inquirerMenu = async () => { //funcion menu
    console.clear();

    console.log('============================='.green);
    console.log('Seleccione una opción'.white);
    console.log('=============================\n'.green);

    const { opcion } = await inquirer.prompt(preguntas); //devuelve la respuesta del usuario
    return opcion;
}

const pausa = async () => {
    const question = [
        {
            type: 'input',
            name: 'enter',
            message: `Presione ${'enter'.green} para continuar`
        }
    ];
    console.log('\n');
    await inquirer.prompt(question);
}

const leerInput= async ( message ) => {

    const question = [ //data para el inquirer
        {
            type: 'input',
            name: 'desc',
            message,
            validate( value ){
                if( value.length === 0){
                    return 'por favor, ingrese un valor.'
                }
                return true;
            }
        }
    ]

    const { desc } = await inquirer.prompt( question ); //desestructura solo la descripcion
    return desc;
}

const listarLugares = async( lugares = [] ) => {

    const choices = lugares.map( (lugar, i) => { //map retorna otro arreglo modificable
        const idx = `${ i +1}.`.green;

        return{
            value: lugar.id,
            name: `${idx} ${lugar.nombre}`
        }
    });

    choices.unshift({ //agregar opción al arreglo
        value: '0',
        name: '0.'.green+ ' Cancelar'
    });

    const preguntas = [
        {
            type: 'list',
            name: 'id',
            message: 'Seleccione Lugar: ',
            choices
        }
    ]
    const { id } = await inquirer.prompt(preguntas); //devuelve la respuesta del usuario
   return id;

}

//función para confirmar acción
const confirmar = async( message ) => { //recibe el msg desde app

    const question = [
        {
            type: 'confirm', //boolean
            name: 'ok',
            message
        }
    ];
    const { ok } = await inquirer.prompt(question); //devuelve la respuesta del usuario
    return ok;
}

//función para seleccionar varias opciones
const mostrarListadoChecklist = async( tareas = [] ) => {

    const choices = tareas.map( (tarea, i) => { //map retorna otro arreglo modificable
        const idx = `${ i +1}.`.green;

        return{
            value: tarea.id,
            name: `${idx} ${tarea.desc}`,
            checked: ( tarea.completadoEn ) ? true : false //ternario, verifica si está completada
        }
    });

    const pregunta = [
        {
            type: 'checkbox',
            name: 'ids',
            message: 'Selecciones',
            choices
        }
    ]
    const { ids } = await inquirer.prompt(pregunta); //devuelve la respuesta del usuario
   return ids;

}


export {
    inquirerMenu,
    pausa,
    leerInput,
    listarLugares,
    confirmar,
    mostrarListadoChecklist
};