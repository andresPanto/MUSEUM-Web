import { Injectable } from '@nestjs/common';
import { Session } from 'inspector';

@Injectable()
export class AuthService {

  logIn(userId: number, role: string, username: string, session){
    session.userId = userId;
    session.role = role;
    session.username = username
  }

  isLogedInAs(session, role: string): boolean{
    return session.role == role;
  }

  logOut(session, request){
    session.userId = undefined;
    session.role = undefined;
    session.username = undefined
    request.session.destroy()
  }


}