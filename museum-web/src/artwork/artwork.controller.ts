import { Body, Controller, Delete, Get, Param, Post, Put, Res } from '@nestjs/common';
import { ArtworkService } from './artwork.service';

@Controller('artworks')
export class ArtworkController {
  constructor(private readonly artworksService: ArtworkService) {
  }
    @Get(':/idActivity')
    mostrardeactivity(){
        //Render artworks.ejs
    }
    @Get() //Validar si es admin
    mostrarTodos() {
        //Render admin/artworks.ejs
    }
    @Get('new')
    crearArtwork(){
      //Render artwork.ejs
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