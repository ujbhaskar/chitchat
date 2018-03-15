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
  user:any;
  originalUser:any;
  constructor(private auth: AuthenticationService) {
    // this.auth.checkValidLoggedIn();
  }

  ngOnInit() {
    this.getUser();
  }
  toggleEdit(){
    this.editmode = !this.editmode;
    if(!this.editmode){
      console.log('over here: ' , this.originalUser);
      this.user = Object.assign({},this.originalUser);
    }
  }
  getUser(){
    this.auth.getUser().subscribe(
      data=>{
        this.user = Object.assign({},data.obj);
        this.originalUser = Object.assign({},data.obj);
        this.editmode = false;
      },
      error=>{
        console.error(error);
      }
    )

  }
  onSubmit(){
    console.log('in Onsubmit: ' , this.user);
    this.auth.updateUser(this.user).subscribe(
      data=>{
        console.log('updated data ********************** ' , data);
        this.getUser();
      },
      error=>{
        console.error(error);
      }
    )
  }
}
