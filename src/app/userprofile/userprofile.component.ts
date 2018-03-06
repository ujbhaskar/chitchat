import { Component, OnInit } from '@angular/core';
import { NgModel,FormGroup,FormControl, FormsModule } from '@angular/forms';
@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.less']
})
export class UserprofileComponent implements OnInit {
  editmode:Boolean = false;
  constructor() { }

  ngOnInit() {
  }
  toggleEdit(){
    this.editmode = !this.editmode;
  }

}
