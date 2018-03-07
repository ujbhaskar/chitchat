import { Component, OnInit } from '@angular/core';
import { NgModel,FormGroup,FormControl, FormsModule } from '@angular/forms';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.less']
})
export class UserprofileComponent implements OnInit {
  editmode:Boolean = false;
  constructor(private auth: AuthenticationService) {
    this.auth.checkValidLoggedIn();
  }

  ngOnInit() {
  }
  toggleEdit(){
    this.editmode = !this.editmode;
  }

}
