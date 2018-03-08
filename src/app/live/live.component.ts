import { Component, OnInit, OnChanges,SimpleChanges } from '@angular/core';
import { NgModel,NgForm } from '@angular/forms';
import { LiveChatService } from './live.chat.service';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-live',
  templateUrl: './live.component.html',
  styleUrls: ['./live.component.less']
})
export class LiveComponent implements OnInit,OnChanges {
  search:any = '';
  searchResults:any = [];
  searchCompleted:Boolean = false;
  online:Boolean = true;
  usersToChat:[any];
  emailsOfBuddies = [];
  constructor(private auth: AuthenticationService, private liveChatService: LiveChatService) { 
    this.auth.checkValidLoggedIn();
  }

  ngOnInit() {
    this.getBuddies();
  }

  searchInitiate(){
    if(!this.search){
      this.clearSearch();
    }
    else if(this.search.length>=3){
      this.onSubmit();
    }
  }

  ngOnChanges(changes: SimpleChanges){
    console.log(changes);
  }

  getBuddies(){
    this.emailsOfBuddies = [];
    this.liveChatService.getBuddies()
    .subscribe(
      data=>{
        console.log('buddies are : ' , data);
        this.usersToChat = data.obj;
        this.usersToChat.forEach(user=>{
          this.emailsOfBuddies.push(user.email);
        });
      },
      error=>{
        console.error(error);
      }
    );
  }

  onSubmit(){
    this.liveChatService.searchUser(this.search)
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
    this.searchResults.length = 0;
    console.log(this.searchResults);
  }

  toggleOnline(){
    this.online = !this.online;
  }
  addBuddy(email:String){
    this.liveChatService.addBuddy(email).subscribe(
      data=>{
        console.log('data: ' , data);
        this.getBuddies();
      },
      error=>{
        console.error(error);
      }
    )
  }
  banBuddy(email:String){    
    this.liveChatService.deleteBuddy(email).subscribe(
      data=>{
        console.log('data: ' , data);
        this.getBuddies();
      },
      error=>{
        console.error(error);
      }
    )
  }
  selectUser(user:any){
    console.log('user: ' , user);
  }

}
