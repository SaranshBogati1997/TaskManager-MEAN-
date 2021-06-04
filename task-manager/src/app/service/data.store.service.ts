import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserModel } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class DataStoreService {
    currentUser:BehaviorSubject<UserModel> = new BehaviorSubject<UserModel>({ username: '' });

    constructor(private http: HttpClient) {}

    setUser(user:UserModel){
        if(user) this.currentUser.next(user);
    }
    getUser(){
        return this.currentUser.getValue();
    }

}
