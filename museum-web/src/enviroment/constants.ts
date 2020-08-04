import { ENTITIES } from './entities';

export const CONSTANTS = {
  DB: {
    name: "default",
    host: 'localhost',
      port: 32781, // El puerto se debe cambiar según la base
      username: 'museum-web-user', //usuario
      password: 'laclaveesunfactorimportante12345', //pass
      database: 'museum-web', // nombre BD
      entities: [ // Poner todas las entidades de la BD
        ...ENTITIES
      ],
      synchronize: true, // actualiza el esquema de la BD
      dropSchema: true, // vuelve a crear el esquema de la base de datos
  },
  Regex : {
    lettersSpaces: '[a-zA-ZñÑ][a-zA-ZñÑ\\s]*',
    lettersNumbersSpaces: '[0-9a-zA-ZñÑ][0-9a-zA-ZñÑ\\s]*',
  }



}