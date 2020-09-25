import { Controller, Get, Res, Param, Session, Req, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
              private readonly _authService: AuthService) {}

  //Validar si es admin, si es cliente y si está o no logeado
  //Según esto se renderiza el index deslogeado, index logeado o el dashboard del admin
  @Get('/')
    gethome(
        @Res() res
    ) {
        res.render('module_client/index.ejs',{logged_in: true})
  }

  @Get('/admin')
  showDashboard(
    @Session() session,
    @Res() res,
    @Query() queryParams
  ){
    const message = queryParams.message;
    const isLogedIn = this._authService.isLogedInAs(session, 'admin');
    if(!isLogedIn){
     return  res.redirect('/users/admin')
    }
    return res.render('module_admin/dashboard',
      {
        username: session.username,
        message
      })
  }

  @Get('/admin/logout')
  logOutAdmin(
    @Session() session,
    @Res() res,
    @Req() req
  ){
    this._authService.logOut(session, req);
    return res.redirect('/users/admin')

  }
  
  
}
