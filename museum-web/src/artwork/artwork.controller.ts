import { Body, Controller, Delete, Get, Param, Post, Put, Res } from '@nestjs/common';
import { ArtworkService } from './artwork.service';

@Controller('artworks')
export class ArtworkController {
  constructor(private readonly artworksService: ArtworkService) {
  }
  @Get('activity')
  getActivityArtworks(
    @Res() res
  ){
    res.render('module_client/artworks.ejs',{logged_in: false})
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