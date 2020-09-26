import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
  Session,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthorCreateDto } from '../author/dto/author.create-dto';
import { validate, ValidationError } from 'class-validator';
import { UserCreateDto } from './dto/user.create-dto';
import { AuthService } from '../auth/auth.service';
import { UserEntity } from './user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly usersService: UserService,
              private readonly _authService: AuthService) {
  }

  @Get('signup')
  index() {
    //Render sign up template
  }

  @Post('signup')
  signmeup() {
    //For signing up user
  }

  @Get('me') //Valido si es cliente o si es admin (settings.ejs)
  mySettings() {
    //Render sign up template with loaded data
  }

  @Post('me')
  changeSettings() {
    //For saving user info changes
  }

  //----------------------------------------------------------ADMIN----------------------
  @Get('/admin')
  logInAdmin(
    @Res() res,
    @Query() queryParams,
  ) {
    const message = queryParams.message;
    const username = queryParams.username;
    return res.render(
      'module_admin/login',
      {
        message,
        username
      });
  }

  @Post('/admin')
  async logInPost(
    @Session() session,
    @Res() res,
    @Body() bodyParams,
  ) {
    const username = bodyParams.username;
    const password = bodyParams.password;
    console.log(username, password);
    let userInfo;
    try {
      userInfo = await this.usersService.findUSerByCredentials(username, password);

    } catch (e) {
      console.log(e);
      return res.redirect(`/users/admin?username=${username}&message=Log In Failed`);
    }

    if (userInfo) {
      const isAdmin = userInfo.userRoles.some((userRole) => {
        return userRole.role.roleName == 'admin';
      });
      if (isAdmin) {
        this._authService.logIn(userInfo.idUser, 'admin', userInfo.username, session);
        res.redirect('/admin');
      } else {
        return res.redirect(`/users/admin?username=${username}&message=Permission Denied`);
      }
    } else {
      return res.redirect(`/users/admin?username=${username}&message=No user found`);
    }

  }

  @Get()
  async usersAdmin(
    @Res() res,
    @Session() session,
    @Query() queryParams,
  ){
    const isNotAdmin = !this._authService.isLogedInAs(session, 'admin');
    if (isNotAdmin){
      return res.redirect('/users/admin')
    }
    let users;
    const message = 'Failed to load Users';
    try {
        users = await this.usersService.findAllClients()
    }catch (e) {
      console.log(e);

    }
    if(users){
      return res.render('module_admin/users',
        {
          username: session.username,
          users,
          message: queryParams.message
        })
    }else{
      return res.redirect(`/admin?message=${message}`)
    }
  }

  @Get('/admin/:id')
  async updateUserView(
    @Session() session,
    @Param() routeParams,
    @Res() res,
    @Query() queryParams,
  ){
    console.log('Get edit');
    const message = 'Cannot edit user';
    const isNotAdmin = !this._authService.isLogedInAs(session, 'admin');
    if (isNotAdmin){
      return res.redirect('/users/admin')
    }
    let user;
    try{
      const id = Number(routeParams.id);
      user = await this.usersService.findOneByID(id)
    }catch (e) {
      console.log(e);
      return res.redirect(`/users?message=${message}`)
    }
    if(user){
      //Todavia no hay la vista
      // res.render(
      //   'module_admin/',
      //   {
      //       message: queryParams.message
      //   }
      // )
      return 'Get edit'
    }else{
      console.log('No user');
      return res.redirect(`/users?message=${message}`)
    }
  }

  @Get('/admin/status/:id')
  async changeStatus(
    @Session() session,
    @Res() res,
    @Param() routePrams
  ){
    console.log('user status');
    const isNotAdmin = !this._authService.isLogedInAs(session, 'admin');
    const message = 'Failed to change user status';
    if (isNotAdmin){
      return res.redirect('/users/admin')
    }
    let updatedUser;
    try {
      const idUser = Number(routePrams.id);
      const user: UserEntity = await this.usersService.findOneByID(idUser);
      user.status = !user.status;
      updatedUser = await this.usersService.update(user)
    }catch (e) {
      console.log(e);
      return res.redirect(`/users?message=${message}`)
    }
    if (updatedUser){
      return res.redirect('/users')
    }else{
      return res.redirect(`/users?message=${message}`)
    }
  }




  @Get()
  getUsers() { //Sólo clientes
    //Render users.ejs
  }

  @Get('/:id')
  editUser(
    @Param()
      parametrosDeRuta,
  ) {
    //Render signup.ejs
  }


  @Post()
  async crearUno(
    @Body()
      parametrosDeCuerpo,
  ) {
    const newUser = new UserCreateDto();
    newUser.fullName = parametrosDeCuerpo.fullName;
    newUser.username = parametrosDeCuerpo.username;
    newUser.password = parametrosDeCuerpo.password;
    newUser.email = parametrosDeCuerpo.email;
    newUser.phoneNumber = parametrosDeCuerpo.phoneNumber;
    newUser.imagePath = parametrosDeCuerpo.imagePath;
    newUser.status = parametrosDeCuerpo.status;

    try {
      const errors: ValidationError[] = await validate(newUser);
      if (errors.length > 0) {
        console.log('Errors', errors);
        throw new BadRequestException('Errors in new User');
      } else {
        return 'No errors';
      }
    } catch (e) {
      console.log(e);
      throw new BadRequestException('Errors validating input');
    }
  }


}