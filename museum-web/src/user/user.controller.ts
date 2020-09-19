import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthorCreateDto } from '../author/dto/author.create-dto';
import { validate, ValidationError } from 'class-validator';
import { UserCreateDto } from './dto/user.create-dto';

@Controller('users')
export class UserController {
  constructor(private readonly usersService: UserService) {
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