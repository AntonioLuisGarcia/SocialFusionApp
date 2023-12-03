/// Rxjs
import { Observable, lastValueFrom, map, tap } from 'rxjs';

/// Service
import { AuthService } from './auth.service';
import { JwtService } from './jwt.service';
import { ApiService } from './api.service';

/// Interfaces
import { StrapiLoginPayload, StrapiLoginResponse, StrapiRegisterPayload, StrapiRegisterResponse } from '../interfaces/strapi';
import { UserCredentials } from '../interfaces/UserCredentials';
import { UserRegister } from '../interfaces/UserRegister';
import { User, UserBasicInfo, UserExtended } from '../interfaces/User';


export class AuthStrapiService extends AuthService{

  constructor(
    private jwtSvc:JwtService,
    private apiSvc:ApiService
  ) { 
    super();
    this.init();
  }

  private init(){
    this.jwtSvc.loadToken().subscribe(
      {
        next:(logged)=>{
          this._logged.next(logged!='');
        },
        error:(err)=>{
          console.log("No hay token");
        }
      }      
    );
  }

  public searchUser(username: string): Observable<User[]> {
    return this.apiSvc.get(`/users?filters[username][$contains]=${username}`).pipe(
      map(response => response.map(((user:User) => ({
        id: user.id,
        username: user.username,
        name: user.name
        // Añade aquí cualquier otra propiedad que necesites
      })))
    ));
  }
  
  public override deleteUser(id: number): Observable<any> {
    return this.apiSvc.delete(`/users/${id}`).pipe(
      tap({
        next: (response) => {
          console.log('Usuario eliminado con éxito', response);
          // Aquí puedes añadir más lógica si necesitas hacer algo justo después de eliminar el usuario
        },
        error: (error) => {
          console.error('Error al eliminar el usuario', error);
        }
      })
    );
  }

  public login(credentials:UserCredentials):Observable<void>{
    return new Observable<void>(obs=>{
      const _credentials:StrapiLoginPayload = {
        identifier:credentials.username,
        password:credentials.password
      };
      this.apiSvc.post("/auth/local", _credentials).subscribe({
        next:async (data:StrapiLoginResponse)=>{
          await lastValueFrom(this.jwtSvc.saveToken(data.jwt));
          this._logged.next(data && data.jwt!='');
          obs.next();
          obs.complete();
        },
        error:err=>{
          obs.error(err);
        }
      });
    });
  }

  logout():Observable<void>{
    return this.jwtSvc.destroyToken().pipe(map(_=>{
      this._logged.next(false);
      return;
    }));
  }

  register(info:UserRegister):Observable<void>{
    return new Observable<void>(obs=>{
      const _info:StrapiRegisterPayload = {
        name:info.name,
        email:info.email,
        username:info.username,
        password:info.password
      }
      this.apiSvc.post("/auth/local/register", info).subscribe({
        next:async (data:StrapiRegisterResponse)=>{
          let connected = data && data.jwt !='';
          this._logged.next(connected);
          await lastValueFrom(this.jwtSvc.saveToken(data.jwt));
          /*const _extended_user:StrapiExtendedUser = {
            name:info.name,
            username:info.username,
            user_id:data.user.id,
            /////////////////////////
          }
          await lastValueFrom(this.apiSvc.post("/extended_user", _extended_user)).catch;*/
          obs.next();
          obs.complete();
        },
        error:err=>{
          obs.error(err);
        }
      });
    });
  }

  public me():Observable<UserExtended>{
    return new Observable<UserExtended>(obs=>{
      this.apiSvc.get('/users/me?populate=*').subscribe({
        next:async (user:any)=>{
          //let extended_user = await lastValueFrom(this.apiSvc.get(`/users?filters[id]=${user.id}`));

          const imageUrl = user.image ? user.image.url : null;

          let ret:UserExtended = {
            id:user.id,
            name:user.name,
            username:user.username,
            email:user.email,
            password:user.password,
            description:user.description,
            img: imageUrl
          }
          obs.next(ret);
          obs.complete();
        },
        error: err=>{
          obs.error(err);
        }
      });
    }); 
  }

  public updateUser(id: number, userData:UserBasicInfo): Observable<UserBasicInfo> {
    return this.apiSvc.put(`/users/${id}`, userData);
  }

}
