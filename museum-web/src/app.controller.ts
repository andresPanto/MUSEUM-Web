import { Controller, Get, Res, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
    gethome(
        @Res() res
    ) {
        res.render('module_client/index.ejs',{logged_in: false}) // Nombre de la vista (archivo)
  }


}
