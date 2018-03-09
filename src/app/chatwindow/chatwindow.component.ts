import { Component, OnInit, HostListener, Input, Output, OnChanges, EventEmitter, SimpleChanges } from '@angular/core';
import { NgModel,NgForm } from '@angular/forms';
import { Message } from '../models/message.model';
import { MessageService } from './message.service';

@Component({
  selector: 'app-chatwindow',
  templateUrl: './chatwindow.component.html',
  styleUrls: ['./chatwindow.component.less']
})
export class ChatwindowComponent implements OnInit,OnChanges {
  @Input() user:any;  
  @Output() deSelect: EventEmitter<any> = new EventEmitter<any>();
  msgHeight:String;
  currentMessage: Message;
  sendingMessage:Boolean = false;
  constructor(private msgService: MessageService) { }

  ngOnInit() {
    this.detectMsgHeight();
  }
  ngOnChanges(changes:SimpleChanges){
    let keys = Object.keys(changes);
    keys.forEach(change=>{
      if(change==='user'){
        // console.log('Finally: ' , changes[change].currentValue);
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
  onSubmit(form:any){
    console.log('form: ' , form);
    // this.currentMessage = {
		// 	message: form.message,
		// 	sender:user,
		// 	receiver:[this.user.email],
		// 	type:'one-to-one',
		// 	date: new Date().toUTCString(),
		// 	seen:false
		// }
		// this.sendingMessage = true
		// this.messageService.saveMessage(this.currentMessage).subscribe(
    //       (data) => {
    //       	$('#uj').html('');
		// 	this.getMessages();
		// 	this.sendingMessage = false;
    //       }
		// );
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.detectMsgHeight();
  }

}
