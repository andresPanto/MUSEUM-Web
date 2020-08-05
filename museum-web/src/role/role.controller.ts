import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { RoleService } from './role.service';

@Controller('roles')
export class RoleController {
  constructor(private readonly _rolesService: RoleService) {
  }

  @Get()
    mostrarTodos(){

    }
    @Get('/:id')
    mostrarUno(
      @Param() parametrosDeRuta
    ){

    }
    @Post()
    crearUno(
      @Body() parametrosDeCuerpo
    ){

    }
    @Put('/:id')
    editarUno(
      @Param() parametrosDeRuta,
      @Body() parametrosDeCuerpo
    ){

    }
    @Delete('/:id')
    eliminarUno(
      @Param() parametrosDeRuta
    ){

    }
}