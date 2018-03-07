import { Component, OnInit } from '@angular/core';
import { NgModel,NgForm } from '@angular/forms';
import { LiveChatService } from './live.chat.service';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-live',
  templateUrl: './live.component.html',
  styleUrls: ['./live.component.less']
})
export class LiveComponent implements OnInit {
  search:any = '';
  searchResults:[any];
  searchCompleted:Boolean = false;
  online:Boolean = true;
  constructor(private auth: AuthenticationService, private liveChatService: LiveChatService) { 
    console.log('in constructor of LiveComponent');
    this.auth.checkValidLoggedIn();
  }

  ngOnInit() {
    console.log('in ngOnInit of LiveComponent');
  }

  onSubmit(formValue: any){
    console.log("Form Value = " + JSON.stringify(formValue, null, 4));
    this.liveChatService.searchUser(formValue.search)
        .subscribe(
            data =>{             
              console.log('got results : ' , data);
              this.searchResults = data.obj;
              this.searchCompleted = true;
            },
            error =>{ 
              console.error(error.error);
            }
        );
  }
  clearSearch(){
    this.search = '';
    this.searchCompleted = false;
  }

  toggleOnline(){
    this.online = !this.online;
  }

}
