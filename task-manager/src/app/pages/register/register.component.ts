import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataStoreService } from 'src/app/service/data.store.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  username: string;
  password: string;
  hasError = false;

  constructor(private router: Router, private userService: UserService, private dataService:DataStoreService) {}

  ngOnInit(): void {}
  register() {
    if (!this.validate()) {
      this.hasError = true;
    } else {
      this.hasError = false;
    }

    this.userService.register(this.username, this.password).subscribe((res) => {
      this.dataService.setUser(res.data.user);
      this.router.navigateByUrl('/');
    });
  }
  validate() {
    if (!this.username || this.username == '') {
      return false;
    } else if (this.password.length < 8) {
      return false;
    } else {
      return true;
    }
  }
}
