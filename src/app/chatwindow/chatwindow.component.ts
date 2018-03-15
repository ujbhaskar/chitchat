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
  userIsTyping:Boolean = false;
  localUser:User;
  currentMessage: Message;
  sendingMessage:Boolean = false;
  typingTime:any;
  constructor(
    private msgService: MessageService, 
    private authService: AuthenticationService,
    private zone:NgZone
  ) { }

  ngOnInit() {
    this.detectMsgHeight();
    this.localUser = this.authService.selfUser;
    try{
    }
    catch(e){
    }
  }
  ngOnChanges(changes:SimpleChanges){
    var self = this;
    let keys = Object.keys(changes);
    self.localUser = self.authService.selfUser;
    keys.forEach(change=>{
      if(change==='user' && changes[change].currentValue){
        self.getMessages();
        
        self.zone.run(function(){
          if(!socket.hasListeners('messageSaved'+self.localUser.email+'->'+self.user.email)){
            socket.on('messageSaved'+self.localUser.email+'->'+self.user.email, function(){
              self.getMessages();
            });
          }
          if(!socket.hasListeners('messageSaved'+self.user.email+'->'+self.localUser.email)){
            socket.on('messageSaved'+self.user.email+'->'+self.localUser.email, function(){
              self.getMessages();
            });
          }
          if(!socket.hasListeners('readMessage'+self.user.email)){
            socket.on('readMessage'+self.user.email,function(){
              self.getMessages();
            })
          }
          
          if(!socket.hasListeners('typing:'+self.user.email+'>'+self.localUser.email)){
            socket.on('typing:'+self.user.email+'>'+self.localUser.email,function(){
              self.zone.run(function(){                
                self.userIsTyping = true;
              });
              clearTimeout(self.typingTime);
              self.typingTime = setTimeout(function(){
                self.zone.run(function(){
                  self.userIsTyping = false;
                });
              },2000);
            })
          }

        });
        self.messageBoxActive();
      }
    });
  }
  Cancel(){
    var self = this;
    if(socket.hasListeners('messageSaved'+self.localUser.email+'->'+self.user.email)){
      socket.removeListener('messageSaved'+self.localUser.email+'->'+self.user.email);
    }
    if(socket.hasListeners('messageSaved'+self.user.email+'->'+self.localUser.email)){
      socket.removeListener('messageSaved'+self.user.email+'->'+self.localUser.email);
    }
    if(socket.hasListeners('readMessage'+self.user.email)){
      socket.removeListener('readMessage'+self.user.email);
    }
    if(socket.hasListeners('typing:'+self.user.email+'>'+self.localUser.email)){
      socket.removeListener('typing:'+self.user.email+'>'+self.localUser.email);
    }
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
  compareDate(d1, d2){
    return (new Date(d1).getDate() + '-' + new Date(d1).getMonth() + '-' + new Date(d1).getFullYear() === new Date(d2).getDate() + '-' + new Date(d2).getMonth() + '-' + new Date(d2).getFullYear())
  }
	messageBoxActive(){
		socket.emit('messagesSeen',{sender: this.user.email,receiver:this.localUser.email});	
	}
  getMessages(){
    var self = this;
		if(!self.user)
			return;
		self.msgService.getMessages(self.user.email).subscribe(
			(data)=>{
        self.zone.run(function(){
          self.messageList = data.obj;
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
            form.reset();
            this.sendingMessage = false;
          },
          error=>{
            console.error(error);
          }
		);
  }
  userTyping(){
    socket.emit('typing',{sender:this.localUser.email,receiver:this.user.email});
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.detectMsgHeight();
  }

}
