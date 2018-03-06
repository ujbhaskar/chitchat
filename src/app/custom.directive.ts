import { 
    NgModel,
    FormGroup,
    FormControl,
    Validators,
    ReactiveFormsModule,
    NG_VALIDATORS,
    FormsModule,ValidatorFn,
    Validator
} from '@angular/forms';
import { Directive,ElementRef,Renderer,Component,Input,HostListener,OnChanges } from '@angular/core';


@Directive({
  selector: '[ujjal]'
})
export class TestDirective{
  constructor(private el:ElementRef,private renderer:Renderer){
      var x = ['111111','222222','00ff00','0000ff','ff0000'];
    //   el.nativeElement.style.backgroundColor = '#'+ x[Math.floor(Math.random()*6)];
    // renderer.setElementStyle(el.nativeElement, 'backgroundColor', 'gray');
  }
}

@Component({
    selector: '[round-switch]',
    inputs: ['enabled'],
    template:   `<span class="relative enabled switch-rail">
                    <span draggable="true" class="wheel absolute"></span>
                </span>`
})
export class RoundSwitch implements OnChanges{
    @Input() enabled:Boolean;
    constructor(private el:ElementRef,private renderer:Renderer){
        // console.log('over here');
        if(this.enabled){
           this.el.nativeElement.className+=' on' ;
        }
        else{
            this.el.nativeElement.className+=' off' ;
        }
    }
    @HostListener('mouseenter') onMouseEnter(){
        // this.highlightColor('red');
        // console.log(this.el);
        // console.log(this.el.nativeElement.firstChild.classList);
        // this.el.nativeElement.className = 'on';
        // this.renderer.addClass(this.el, 'switch-on');
        // this.el.nativeElement.addClass('switch-on');
        // this.el.nativeElement.removeClass('switch-off');
    }
    @HostListener('click', ['$event.target']) onClick(){}
    @HostListener('mouseleave') onMouseLeave(){}
    public highlightColor(color){
        this.el.nativeElement.style.backgroundColor = color;
    }
    ngOnChanges(changes){
        if(changes.enabled.currentValue.toString() === 'true'){
            this.el.nativeElement.className = this.el.nativeElement.className.replace(/off/g, 'on');
        }
        else{
            this.el.nativeElement.className = this.el.nativeElement.className.replace(/on/g, 'off');
        }
    }
}


@Directive({  
    selector: '[emailvalidator][ngModel]',  
    providers: [  
        {  
            provide: NG_VALIDATORS,  
            useExisting: EmailValidator,  
            multi: true  
        }
    ]
})  
export class EmailValidator implements Validator {  
    validator: ValidatorFn;  
    constructor() {  
        console.log('in EmailValidator constructor');
        this.validator = this.emailValidator();  
    }  
    validate(c: FormControl) {  
        return this.validator(c);  
    }  

    emailValidator(): ValidatorFn {
        return (c: FormControl) => {
            let isValid = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/.test(c.value);  
            if (isValid) {  
                return null;  
            } else {  
                return {
                    emailvalidator: {  
                        valid: false  
                    }  
                };  
            }  
        }  
    }

}