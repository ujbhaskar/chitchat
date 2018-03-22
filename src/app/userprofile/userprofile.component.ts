import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { NgModel,FormGroup,FormControl, FormsModule } from '@angular/forms';
import { AuthenticationService } from '../authentication.service';
import { FileSelectDirective, FileUploader } from 'ng2-file-upload';
import { saveAs } from 'file-saver';
import {DomSanitizer} from '@angular/platform-browser';

const URL = 'http://localhost:3000/user/uploadImage?token='+localStorage.getItem('token');

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.less']
})
export class UserprofileComponent implements OnInit {
  uploader:FileUploader = new FileUploader({url:this.getURL()});
  attachmentList:any = [];
  imgSrc: any = '';
  filesArray: any = [];
  profilePicURI:String = '';
  editmode:Boolean = false;
  user:any;
  originalUser:any;
  getURL(){
    return 'http://localhost:3000/user/uploadImage?token='+localStorage.getItem('token');
  }
  constructor(
    private el: ElementRef,
    private sanitizer:DomSanitizer,
    private auth: AuthenticationService
  ) {
    // this.auth.checkValidLoggedIn();
      this.uploader.onAfterAddingFile = (file)=> { file.withCredentials = false; };
      this.uploader.onCompleteItem = (item:any, res:any, status:any, headers:any)=>{        
        this.getUser();
        res = JSON.parse(res);
        console.log('res : ', res);
        // console.log('res : ', typeof res);
        // this.profilePicURI = 'http://localhost:3000/user/image/'+res.file.filename;
        // console.log('this.profilePicURI : ' , this.profilePicURI);
        // this.attachmentList.push(JSON.parse(res));
        console.log('over here');
        // this.getAllFiles();
      }
  }

  // upload() {
  //   // console.log('in upload');
  //   //   let inputEl: HTMLInputElement = this.el.nativeElement.querySelector('#photo');
  //   //   let fileCount: number = inputEl.files.length;
  //   //   console.log('inputEl : ' , inputEl.files);
  //   //   let formData = new FormData();
  //   //   if (fileCount > 0) {
  //   //     formData.append('photo', inputEl.files.item(0));
  //   //     this.auth.uploadFile(formData).subscribe(
  //   //       data => {
  //   //         console.log('data!!!');
  //   //         alert(data);
  //   //       },
  //   //       error =>{
  //   //         console.log('error: ' , error);
  //   //         alert(error)
  //   //       }
  //   //     );
  //   //   }
  //   //   else{
  //   //     console.log('no files selected');
  //   //   }
  // }

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
