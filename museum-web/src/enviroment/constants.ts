import { ENTITIES } from './entities';

export const CONSTANTS = {
  DB: {
    name: "default",
    host: 'localhost',
      port: 3306, // El puerto se debe cambiar según la base
      username: 'root', //usuario
      password: '', //pass
      database: 'museum-web', // nombre BD
      entities: [ // Poner todas las entidades de la BD
        ...ENTITIES
      ],
      synchronize: true, // actualiza el esquema de la BD
      dropSchema: false, // vuelve a crear el esquema de la base de datos
  },
  Regex : {
    lettersSpaces: '[a-zA-ZñÑ][a-zA-ZñÑ\\s]*',
    lettersNumbersSpaces: '[0-9a-zA-ZñÑ][0-9a-zA-ZñÑ\\s]*',
    email: '(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))',
    phone: '\\(?\\+[0-9]{1,3}\\)? ?-?[0-9]{1,3} ?-?[0-9]{3,5} ?-?[0-9]{4}( ?-?[0-9]{3})? ?(\\w{1,10}\\s?\\d{1,6})?',
    schedule: '([0-1]?[0-9]|2[0-3]):[0-5][0-9]-([0-1]?[0-9]|2[0-3]):[0-5][0-9]',
    hour: '([0-1]?[0-9]|2[0-3]):[0-5][0-9]',
    activityDuration: '([0-1]?[0-9]|2[0-3]):[0-5][0-9]',
    activityType: 'Tour|Film|Performance|Exhibition',


  }



}