import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../interfaces/User';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private api:ApiService) { }

  private _users:BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
  public users$:Observable<User[]> = this._users.asObservable();

  public getAllUser(user:User):Observable<User>{
    return this.api.get("user");//verificar esto
  }

  public updateUser(user:User):Observable<User>{
    return this.api.put("user",user);//verificar
  }

  public patchUser(user:User):Observable<User>{
    return this.api.patch("user",user);//verificar
  }

  public postUser(user:User):Observable<User>{
    return this.api.post("user",user);//verificar
  }

  public deleteUser(user:User):Observable<User>{
    return this.api.delete("user",user);//verificar
  }
}
