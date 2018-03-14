import { Component, OnInit, HostListener, Input,
         Output, OnChanges, EventEmitter, NgZone,
         SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { NgModel,NgForm } from '@angular/forms';
import { Message } from '../models/message.model';
import { User } from '../models/user.model';
import { MessageService } from './message.service';
import {socket} from "../provideSocket";
import { AuthenticationService } from '../authentication.service';
import { error } from 'selenium-webdriver';

@Component({
  selector: 'app-chatwindow',
  templateUrl: './chatwindow.component.html',
  styleUrls: ['./chatwindow.component.less']
})
export class ChatwindowComponent implements OnInit,OnChanges {
  @ViewChild('msgWindow') private msgWindowRef: ElementRef;
  @Input() user:any;
  @Output() deSelect: EventEmitter<any> = new EventEmitter<any>();
  msgHeight:String;
  message: String;
  messageList:[Message];
  localUser:User;
  currentMessage: Message;
  sendingMessage:Boolean = false;
  constructor(
    private msgService: MessageService, 
    private authService: AuthenticationService,
    private zone:NgZone
  ) { }

  ngOnInit() {
    this.detectMsgHeight();
    this.localUser = this.authService.selfUser;
    console.log('this.localUser: ' , this.localUser);
    console.log('this.user: ' , this.user);
    try{
      console.log('socket : ' , socket);
    }
    catch(e){
      console.log(e);
    }
  }
  ngOnChanges(changes:SimpleChanges){
    var self = this;
    let keys = Object.keys(changes);
    self.localUser = self.authService.selfUser;
    keys.forEach(change=>{
      if(change==='user' && changes[change].currentValue){
        console.log('changes are: ',changes);
        console.log('changes currentValue : ', changes[change].currentValue);
        console.log('Finally: ' , changes[change].currentValue);
        console.log('Finally self.user: ' , self.user);
        console.log('self.localUser: ' , self.localUser);
        self.getMessages();
        
        console.log('messageSaved'+self.localUser.email+'->'+self.user.email);
        console.log('messageSaved'+self.user.email+'->'+self.localUser.email);
        
        self.zone.run(function(){
          console.log('in self zone run');
          socket.on('messageSaved'+self.localUser.email+'->'+self.user.email, function(){
            console.log('inside receiver of : ' + 'messageSaved'+self.localUser.email+'->'+self.user.email);
            self.getMessages();
          });
          socket.on('messageSaved'+self.user.email+'->'+self.localUser.email, function(){
            console.log('inside receiver of : ' + 'messageSaved'+self.user.email+'->'+self.localUser.email);
            self.getMessages();
          });
          
          socket.on('readMessage'+self.user.email,function(){
            console.log('inside readMessage of : ' + 'readMessage'+self.user.email);
            self.getMessages();
          })
        });
        self.messageBoxActive();
      }
    });
  }
  Cancel(){
    this.deSelect.emit('close');
  }
  detectMsgHeight(){
    console.log('inside detectMsgHeight');
    var docHeight = document.body.clientHeight;
    if(document.body.clientWidth>=992){
      this.msgHeight = (docHeight - 180)+'px';
    }
    else if(document.body.clientWidth>=768){
      this.msgHeight = (docHeight - 150)+'px';
    }
    else{
      this.msgHeight = (docHeight - 141)+'px';
    }
  }
  compareDate(d1, d2){
    // console.log('in compareDate where d1: ' + d1 + ' and d2 = ' + d2);
    return (new Date(d1).getDate() + '-' + new Date(d1).getMonth() + '-' + new Date(d1).getFullYear() === new Date(d2).getDate() + '-' + new Date(d2).getMonth() + '-' + new Date(d2).getFullYear())
  }
	messageBoxActive(){
    console.log('inside messageBoxActive: ');
		socket.emit('messagesSeen',{sender: this.user.email,receiver:this.localUser.email});	
    console.log('last of  messageBoxActive: ');
	}
  getMessages(){
    var self = this;
		if(!self.user)
			return;
		self.msgService.getMessages(self.user.email).subscribe(
			(data)=>{
        self.zone.run(function(){
          self.messageList = data.obj;
          console.log('messages retrieved : ' , self.messageList);
          setTimeout(function(){
            self.msgWindowRef.nativeElement.scrollTop = self.msgWindowRef.nativeElement.scrollHeight;
          },100);
        });
      },
      error=>{
        console.error(error);
      }
		);
  }
  onSubmit(form:NgForm){
    console.log('form: ' , form);
    this.currentMessage = {
			message: form.form.value.message,
			sender: this.authService.selfUser.email,
			receiver:[this.user.email],
			type:'one-to-one',
			date: new Date().toUTCString(),
			seen:false
		}
		this.sendingMessage = true;
		this.msgService.saveMessage(this.currentMessage).subscribe(
          (data) => {
          	console.log('message send success : ' , data);
            form.reset();
            this.sendingMessage = false;
          },
          error=>{
            console.error(error);
          }
		);
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.detectMsgHeight();
  }

}
