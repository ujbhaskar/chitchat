export class Message {
    constructor(
    	public message: String,
    	public sender: String,
    	public receiver: [String],
    	public type: String,
    	public date: String,
    	public seen:Boolean
    	) {}
}