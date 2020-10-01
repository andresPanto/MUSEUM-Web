import { BadRequestException, Body, Controller, Get, Param, Post, Req, Res, Session, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { validate, ValidationError } from 'class-validator';
import { UserCreateDto } from './dto/user.create-dto';
import { AuthService } from 'src/auth/auth.service';
import { UserEntity } from './user.entity';
import { diskStorage } from 'multer';
import {  FileInterceptor } from '@nestjs/platform-express';
import { UserRoleService } from 'src/user-role/user-role.service';
import { UserRoleEntity } from 'src/user-role/user-role.entity';
import { RoleService } from 'src/role/role.service'; 
import { UserUpdateDto } from './dto/user.update-dto';

@Controller('users')
export class UserController {
  constructor(private readonly _usersService: UserService,
    private readonly _authService: AuthService,
    private readonly _userRoleService: UserRoleService,
    private readonly _roleService: RoleService) {
  }

  @Get('signup')
  async index(
    @Res() res,
    @Session() session,
    @Query() query
  ){
    const estaLogeado = session.username;
    if(estaLogeado){
      return res.redirect('back');
    }else{
      return res.render('module_client/signup', {error: query.error, fullname: query.fullname,
      email: query.email, phone: query.phone, username: query.username})
    }
  }

  // noinspection TypeScriptValidateTypes
  @Post('signup')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: 'public/images/users/',
    }),
  }))
  async signmeup(
    @Body() body,
    @Res() res,
    @UploadedFile() file,
    @Session() session
  ){
    try{
    const validUser = new UserCreateDto();
    validUser.fullName = body.fullname;
    validUser.email = body.email;
    validUser.phoneNumber = body.phone;
    validUser.username = body.username;
    validUser.password = body.password;
    validUser.status = true;
    //The file extension(mimetype) should also be validated.
    const validImage = typeof file != 'undefined';    
    const errors: ValidationError[] = await validate(validUser);
    const previousData = `&fullname=${body.fullname}&email=${body.email}&phone=${body.phone.replace("+","%2B")}&username=${body.username}`;
    if(errors.length > 0){
      console.error('Errores:',errors);
      res.redirect('/users/signup?error=Invalid data!'+previousData);
      }else{
        if(body.password === body.cpassword){
          if(validImage){
            const user = {
              username: body.username,
              password: body.password,
              email: body.email,
              fullName: body.fullname,
              phoneNumber: body.phone,
              imagePath: '/images/users/'+file.filename, //This is a hashed(?) name, this is the one that is saved into the database
              status: true
            } as UserEntity;
            try{
              const response = await this._usersService.createUser(user);
              if(response){
                try{
                  let clientRole = await this._roleService.getRole('client');
                  let ex: UserRoleEntity = new UserRoleEntity();
                  ex.user = response;
                  ex.role = clientRole;
                  const role = await this._userRoleService.saveClient(ex);
                  if (role){
                    this._authService.logIn(Number(response.idUser), 'client', user.username, session);
                    return res.redirect('/?message=Welcome '+body.username+'!');
                  }else{
                    return res.redirect('/users/signup?error=Error creating user, try again later.'+previousData);
                  }
                }catch(e){
                  console.log("ERROR",e);
                  return res.redirect('/users/signup?error=Error creating user, try again later.'+previousData);
                }
              }
            }catch (e){
              console.log("Error:", e)
              return res.redirect('/users/signup?error=Error creating user, try again later.'+previousData);
            }
          }else{
            return res.redirect('/users/signup?error=Select an image!'+previousData);
          }
        }else{
            return res.redirect('/users/signup?error=Passwords do not match!'+previousData);
        }
            
        
      }
    }catch(e){
        console.log("ERROR: ",e);
        return res.redirect('/');
    }
    
  }
  @Post('login')
  async login(
    @Body() body,
    @Res() res,
    @Session() session,
    @Req() req
  ){
    //¿Se tiene que validar aquí también si ya se está logeado?
    const username = body.username;
    const password = body.password;
    console.log(username, password);
    let userInfo;
    try {
      userInfo = await this._usersService.findUSerByCredentials(username, password);

    } catch (e) {
      console.log(e);
      return res.redirect(`/?message=Error while logging in, try again later.`);
    }

    if (userInfo) {
      const isClient = userInfo.userRoles.some((userRole) => {
        return userRole.role.roleName == 'client';
      });
      if (isClient) {
        this._authService.logIn(userInfo.idUser, 'client', userInfo.username, session);
        //To replace the message that appears when Log in -> Log Out -> Log In
        let backURL=req.header('Referer') || '/';
        if(backURL.includes('?error') || backURL.includes('?message')){
          let re = backURL.split("?")[0] + "?message=Welcome Back!"
          res.redirect(re);
        }else{
          if(backURL.includes('signup')){
            res.redirect('/');
          }else{
            res.redirect('back');
          }
        }
      } else {
        return res.redirect(`/?message=Access Denied`);
      }
    } else {
      return res.redirect(`/?error=Invalid Credentials`);
    }

    return res.redirect('/');
  }
  @Get('logout')
  logout(
    @Res() res,
    @Session() session,
    @Req() req
  ){
    const logged_in = (typeof session.username != 'undefined');
    if(logged_in){
      this._authService.logOut(session,req);
      res.redirect(`/?message=Logged Out Successfully!`);
    }
  }
  @Get('me') //Valido si es cliente o si es admin (settings.ejs)
  async mySettings(
    @Res() res,
    @Query() query,
    @Body() body,
    @Session() session
  ){
    if(typeof session.username != 'undefined'){
      try{
        let user = await this._usersService.findOneByID(session.userId);
        if(user){
          res.render('module_client/signup', {username:user.username, user:user, error:query.error,success:query.success});
        }
      }catch(e){
        console.error("Error while gettin user data: ",e);
        res.redirect('back');
      }
    }else{
      res.redirect('back');
    }
    
  }

  // noinspection TypeScriptValidateTypes
  @Post('me')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: 'public/images/users/',
    }),
  }))
  async changeSettings(
    @Body() body,
    @Res() res,
    @UploadedFile() file,
    @Session() session
  ){
    const idUser = session.userId;
    const validUser = new UserUpdateDto();
    validUser.email = body.email;
    validUser.phoneNumber = body.phone;
    if(body.password != ''){
      validUser.password = body.password;
      validUser.password = body.cpassword;
    }
    const validImage = typeof file != 'undefined';    
    const errors: ValidationError[] = await validate(validUser);
    if(errors.length > 0){
      console.error('Errores:',errors);
      res.redirect('/users/me?error=Invalid data!');
      }else{
        if(body.password != ''){
          if(body.password === body.cpassword){
            if(validImage){
              //The image and the password were changed
              const user = {
                idUser: idUser,
                password: body.password,
                email: body.email,
                phoneNumber: body.phone,
                imagePath: '/images/users/'+file.filename
              } as UserEntity;
              try{
                let response = await this._usersService.update(user);
                if(response){
                  res.redirect('/users/me?success=Changes saved successfully')
                }
              }catch (e){
                console.log("Error:", e)
                return res.redirect('/users/me?error=Error saving changes, try again later.');
              }
            }else{
              //The image was not changed and the password was
              const user = {
                idUser: idUser,
                password: body.password,
                email: body.email,
                phoneNumber: body.phone
              } as UserEntity;
              try{
                let response = await this._usersService.update(user);
                if(response){
                  res.redirect('/users/me?success=Changes saved successfully')
                }
              }catch (e){
                console.log("Error:", e)
                return res.redirect('/users/me?error=Error saving changes, try again later.');
              }
            }
          }else{
              return res.redirect('/users/me?error=Passwords do not match!');
          }
        }else{
          if(validImage){
              //The image was changed and the password was not
              const user = {
                idUser: idUser,
                email: body.email,
                phoneNumber: body.phone,
                imagePath: '/images/users/'+file.filename
              } as UserEntity;
              try{
                let response = await this._usersService.update(user);
                if(response){
                  res.redirect('/users/me?success=Changes saved successfully')
                }
              }catch (e){
                console.log("Error:", e)
                return res.redirect('/users/me?error=Error saving changes, try again later.');
              }
            }else{
              //The image was not changed and neither was the password
              const user = {
                idUser: idUser,
                email: body.email,
                phoneNumber: body.phone
              } as UserEntity;
              try{
                let response = await this._usersService.update(user);
                if(response){
                  res.redirect('/users/me?success=Changes saved successfully')
                }
              }catch (e){
                console.log("Error:", e)
                return res.redirect('/users/me?error=Error saving changes, try again later.');
              }
            }
        }
        
      }
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
      userInfo = await this._usersService.findUSerByCredentials(username, password);

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
        users = await this._usersService.findAllClients()
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
      user = await this._usersService.findOneByID(id)
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
      const user: UserEntity = await this._usersService.findOneByID(idUser);
      user.status = !user.status;
      updatedUser = await this._usersService.update(user)
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