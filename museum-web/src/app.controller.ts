import { Controller, Get, Res, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  //Validar si es admin, si es cliente y si está o no logeado
  //Según esto se renderiza el index deslogeado, index logeado o el dashboard del admin
  @Get('/')
    gethome(
        @Res() res
    ) {
        res.render('module_client/index.ejs',{logged_in: true})
  }
  
  
}
