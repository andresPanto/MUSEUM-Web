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
  }


  //name: 'default', //nombre de la conexion
  //   type: 'mysql',  // tipo de BD
  //   host: 'localhost',
  //   port: 32779,
  //   username: 'mysql-web-clases', //usuario
  //   password: 'laclaveesunfactorimportante12345', //pass
  //   database: 'mysql-web-clases', // nombre BD
  //   entities: [ // Poner todas las entidades de la BD
  //     UsuarioEntity
  //   ],
  //   synchronize: true, // actualiza el esquema de la BD
  //   dropSchema: true, // vuelve a crear el esquema de la base de datos
}