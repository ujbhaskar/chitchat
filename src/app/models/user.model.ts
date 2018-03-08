export class User{

  constructor(
    public firstName: String,
    public lastName: String,
    public email: String,    
  ) {  }

}

export class FullProfile{

  constructor(
    public firstName: String,
    public lastName: String,
    public email: String,
    public buddies: String,
    public city: String,
    public country: String,
    public isOnline: String
  ) {  }

}