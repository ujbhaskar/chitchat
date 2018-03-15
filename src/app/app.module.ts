import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { TestDirective,EmailValidator,RoundSwitch } from './custom.directive';
import { EmojiPipe, LocalDatePipe, LocalTimePipe } from './custom.pipe';
import { UserprofileComponent } from './userprofile/userprofile.component';
import { AuthenticationService } from './authentication.service';
import { LiveComponent } from './live/live.component';
import { LiveChatService } from './live/live.chat.service';
import { ChatwindowComponent } from './chatwindow/chatwindow.component';
import { MessageService } from './chatwindow/message.service';

const appRoutes: Routes = [
  { path: 'signin', component: SigninComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'userprofile', component: UserprofileComponent },
  { path: 'live', component: LiveComponent },
  { path: 'forgotpassword', component: ForgotpasswordComponent },
  { path: '**', component: SigninComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    SigninComponent,
    SignupComponent,
    ForgotpasswordComponent,
    TestDirective,
    EmailValidator,
    RoundSwitch,
    LocalDatePipe,
    EmojiPipe,
    LocalTimePipe,
    UserprofileComponent,
    LiveComponent,
    ChatwindowComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    AuthenticationService,
    LiveChatService,
    MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
