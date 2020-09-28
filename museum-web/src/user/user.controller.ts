import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Res, Session } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthorCreateDto } from '../author/dto/author.create-dto';
import { validate, ValidationError } from 'class-validator';
import { UserCreateDto } from './dto/user.create-dto';

@Controller('users')
export class UserController {
  constructor(private readonly usersService: UserService) {
  }
  @Get('signup')
  index(
    @Res() res,
    @Session() session
  ){
    const estaLogeado = session.usuario;
    if(estaLogeado){
      return res.redirect('/');
    }else{
      return res.render('module_client/signup',{logged_in:false})
    }
      //Render sign up template
  }
  @Post('signup')
  signmeup(){
    //For signing up user
  }
  @Get('me') //Valido si es cliente o si es admin (settings.ejs)
  mySettings(){
    //Render sign up template with loaded data
  }
  @Post('me')
  changeSettings(){
    //For saving user info changes
  }
  //----------------------------------------------------------ADMIN----------------------
  @Get('admin')
  loginadmin(){
    //Render admin/login.ejs
  }
  @Get()
  getUsers(){ //Sólo clientes
    //Render users.ejs
  }
  @Get('/:id')
  editUser(
    @Param() parametrosDeRuta
  ){
      //Render signup.ejs
    }
  
  
  @Post()
  async crearUno(
    @Body() parametrosDeCuerpo,
  ) {
    const newUser = new UserCreateDto();
    newUser.fullName = parametrosDeCuerpo.fullName;
    newUser.username = parametrosDeCuerpo.username;
    newUser.password = parametrosDeCuerpo.password;
    newUser.email = parametrosDeCuerpo.email;
    newUser.phoneNumber= parametrosDeCuerpo.phoneNumber;
    newUser.imagePath = parametrosDeCuerpo.imagePath;
    newUser.status = parametrosDeCuerpo.status;

    try {
      const errors : ValidationError[] = await validate(newUser)
      if(errors.length > 0){
        console.log('Errors', errors);
        throw new BadRequestException('Errors in new User')
      }else {
        return 'No errors'
      }
    }catch (e) {
      console.log(e);
      throw new BadRequestException('Errors validating input')
    }
  }
  
  
  
}