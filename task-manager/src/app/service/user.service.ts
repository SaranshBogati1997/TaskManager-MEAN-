import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseModel } from '../models/response.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  getApiUrl() {
    return environment.apiUrl + "/user";
  }

  login(username:string, password:string):Observable<ResponseModel>{
      return this.http.post<ResponseModel>(this.getApiUrl()+"/login", {username: username, password:password} );
  }
  register(username:string, password:string):Observable<ResponseModel>{
      return this.http.post<ResponseModel>(this.getApiUrl()+"/register",
      {
          username:username,
          password:password
      });
  }
}
