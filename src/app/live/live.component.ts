import { Component, OnInit, HostListener, OnChanges,SimpleChanges,NgZone } from '@angular/core';
import { NgModel,NgForm } from '@angular/forms';
import { LiveChatService } from './live.chat.service';
import { User } from '../models/user.model';
import { socket } from "../provideSocket";
import { AuthenticationService } from '../authentication.service';
import { MessageService } from '../chatwindow/message.service';

@Component({
  selector: 'app-live',
  templateUrl: './live.component.html',
  styleUrls: ['./live.component.less']
})
export class LiveComponent implements OnInit,OnChanges {
  search:any = '';
  searchResults:any = [];
  searchCompleted:Boolean = false;  
  localUser:User;
  online:Boolean = true;
  usersToChat:[any];
  selectedUserToChat:any;
  emailsOfBuddies = [];
  isMobileDevice:Boolean = document.body.clientWidth < 767;
  constructor(
    private auth: AuthenticationService, 
    private liveChatService: LiveChatService,
    private messageService: MessageService,
    private zone:NgZone
  ) { 
    // this.auth.checkValidLoggedIn();
  }

  ngOnInit() {
    console.log('--------------');
    var self = this;
    self.localUser = self.auth.selfUser;
    // console.log('localUser : ' , self.localUser);
    if(self.localUser){
      self.getBuddies();
      self.trackCountMessages();
    }
    else{
      self.auth.loggedUser.subscribe((user:User)=>{
        self.localUser = user;
        // console.log('in ngOnint where user :', self.localUser);
        self.getBuddies();
        self.trackCountMessages();
      });
    }
    // socket.on('ping'+user.email,function(email:string){
    //   socket.emit('attendence' , email);
    // });
    // socket.on('loggedUser', function(){
    //   console.log('in loggedUser');
    //     self.getBuddies();
    // });
    // socket.on('awayUser', function(){
    //   console.log('in awayUser');
    //     self.getBuddies();
    // });
    

  }

  searchInitiate(){
    if(!this.search){
      this.clearSearch();
    }
    else if(this.search.length>=3){
      this.onSubmit();
    }
  }

  trackCountMessages(){
    var self = this;
    if(!socket.hasListeners('hello:'+self.localUser.email)){
      socket.on('hello:'+self.localUser.email, function(email){
        // console.log('who is pinging: ' , email);
        // console.log('on hello:'+self.localUser.email);
        // self.getUnseenCounts();
        if(self.selectedUserToChat && self.selectedUserToChat.email === email){
          // console.log('in hello : ' , email);
          socket.emit('messagesSeen',{sender: email,receiver:self.localUser.email});
        }
        if(!self.selectedUserToChat || (email !== self.selectedUserToChat.email)){
          for(var i = 0;i<self.usersToChat.length;i++){
            if(self.usersToChat[i].email===email){
              self.zone.run(function(){
                // console.log('----www3333-----');
                self.getUnseenCounts(email);
              });
              break;
            }
          }
        }
      });
    }
  }

  ngOnChanges(changes: SimpleChanges){
    // console.log(changes);
  }
  assignBuddies(buddies){    
    var self = this;
    self.zone.run(function(){
      // console.log('buddies are : ' , buddies);
      self.usersToChat = buddies;
      self.usersToChat.forEach(user=>{
        self.emailsOfBuddies.push(user.email);
        if(!socket.hasListeners('buddy-activity->'+user.email)){
          socket.on('buddy-activity->'+user.email, function(){
            // console.log('in buddy-activity of : ' , user.email);
              self.getBuddies();
          });
        }
        // io.sockets.emit('messageSeen'+obj.sender+'->'+obj.receiver);
        if(!socket.hasListeners('messageSeen'+user.email+'->'+self.localUser.email)){
          self.trackCountMessages();
        }
      });
    });
  }
  getBuddies(){
    var self = this;
    self.emailsOfBuddies = [];
    self.liveChatService.getBuddies()
    .subscribe(
      data=>{
        self.assignBuddies(data.obj);        
        self.getUnseenCounts(undefined);
        setTimeout(function(){
          // console.log('after getting Unseen Counts self.usersToChat : ' ,self.usersToChat);
        },6000);
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
              // console.log('got results : ' , data);
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
    // console.log(this.searchResults);
  }

  toggleOnline(){
    this.online = !this.online;
  }
  addBuddy(email:String){
    this.liveChatService.addBuddy(email).subscribe(
      data=>{
        // console.log('data: ' , data);
        this.getBuddies();
      },
      error=>{
        console.error(error);
      }
    )
  }
  banBuddy(email:String){
    if(socket.hasListeners('buddy-activity->'+email)){
      socket.removeEventListener('buddy-activity->'+email);
    }
    this.liveChatService.deleteBuddy(email).subscribe(
      data=>{
        // console.log('data: ' , data);
        this.getBuddies();
      },
      error=>{
        console.error(error);
      }
    )
  }
  selectUser(user:any){
    // console.log('user: ' , user);
    this.selectedUserToChat = user;    
    socket.emit('messagesSeen',{sender:user.email,receiver:this.localUser.email});
    user.ping = 0;
  }
  CancelChat(){
    //  console.log('In Deselect ');
     this.selectedUserToChat = undefined;
  }
  
  getUnseenCounts(email){
    // console.log('getUnseenCounts for email: ' , email);
    var self = this;
    if(self.usersToChat.length){      
      for(var i = 0;i<self.usersToChat.length;i++){
        if(self.usersToChat[i].email === email || email==undefined){
            (function(user,index){ 
            self.messageService.getUnseenCounts(user.email).subscribe(
            (data) => {
              // console.log('here user is : ' , user);
              // console.log('data count is : ' , data.obj.count);
              
              self.zone.run(function(){
                user.ping = data.obj.count;
              });
            });
            })(self.usersToChat[i],i);
        }
        // break;
      }
    }
  }
  
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.isMobileDevice = document.body.clientWidth < 767;
    // console.log(event.target.innerWidth);
  }
}
