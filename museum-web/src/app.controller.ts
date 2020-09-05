import { Controller, Get, Res, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
    gethome(
        @Res() res
    ) {
        res.render('module_client/index.ejs',{logged_in: true}) // Nombre de la vista (archivo)
  }
  @Get('/signup')
  signUp(
    @Res() res
  ){
    res.render('module_client/signup.ejs', {logged_in: false})
  }
}
