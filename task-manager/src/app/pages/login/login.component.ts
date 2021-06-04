import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router'
import { DataStoreService } from 'src/app/service/data.store.service';
import {UserService} from '../../service/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  username:string;
  password:string; 
  failedLogin = false;
  showNotification = false;
  notificationMessage: string;

  constructor( private router: Router, private userService:UserService, private dataService: DataStoreService) { }

  ngOnInit(): void {
  }
  login(){
    this.userService.login(this.username, this.password).subscribe(res => {
      if(res.status == 0){
        this.showNotificationAlert(res.data);
        return;
      }
      if(res.data){
        this.failedLogin = false;
        this.dataService.setUser(res.data.user);
        this.router.navigateByUrl("/");
        
      }
      else{
        this.showNotificationAlert("Invalid Username/Password");
      }
    })
    
  }
  showNotificationAlert(message:string){
    this.failedLogin = true;
    this.notificationMessage = message;
    setTimeout(() => {
      this.failedLogin = false
    }, 2000);
  }
}
