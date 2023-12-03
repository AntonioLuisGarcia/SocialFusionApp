/// Angular
import { Injectable } from '@angular/core';

/// Rxjs
import { BehaviorSubject, Observable} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export abstract class AuthService {

  protected _logged = new BehaviorSubject<boolean>(false);
  public isLogged$ = this._logged.asObservable();
  
  public abstract login(credentials:Object):Observable<any>;

  public abstract register(info:Object):Observable<any>;

  public abstract logout():Observable<void>;

  public abstract me():Observable<any>;

  public abstract searchUser(name: string): Observable<any>;

  public abstract deleteUser(id: number): Observable<any>;
}
