import { Component, OnInit, HostListener, Input, Output, OnChanges, EventEmitter, SimpleChanges } from '@angular/core';
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
  @Input() user:any;  
  @Output() deSelect: EventEmitter<any> = new EventEmitter<any>();
  msgHeight:String;
  message: String;
  messageList:[Message];
  localUser:User;
  currentMessage: Message;
  sendingMessage:Boolean = false;
  constructor(private msgService: MessageService, private authService: AuthenticationService) { }

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
    let keys = Object.keys(changes);
    this.localUser = this.authService.selfUser;
    keys.forEach(change=>{
      if(change==='user'){
        console.log('Finally: ' , changes[change].currentValue);
        console.log('Finally this.user: ' , this.user);
        console.log('this.localUser: ' , this.localUser);
        this.getMessages();
      }
    });
  }
  Cancel(){
    this.deSelect.emit('close');
  }
  detectMsgHeight(){
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
  getMessages(){
    var self = this;
		if(!this.user)
			return;
		this.msgService.getMessages(this.user.email).subscribe(
			(data)=>{
				// self.zone.run(function(){
				// 	self.messages = data.obj.map(function(item){
				// 		item.message = item.message;
				// 		return item;
				// 	});
				// 	setTimeout(function(){
				// 		$("div.chatbox-body").scrollTop($('div.chatbox-body').prop('scrollHeight'));
				// 	},100);
        // });
        this.messageList = data.obj;
        console.log('messages retrieved : ' , this.messageList);
      },
      error=>{
        console.error(error);
      }
		);
  }
  onSubmit(form:any){
    console.log('form: ' , form);
    this.currentMessage = {
			message: form.message,
			sender: this.authService.selfUser.email,
			receiver:[this.user.email],
			type:'one-to-one',
			date: new Date().toUTCString(),
			seen:false
		}
		this.sendingMessage = true
		this.msgService.saveMessage(this.currentMessage).subscribe(
          (data) => {
          	console.log('message send success : ' , data);
            this.getMessages();
            this.message = '';
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
