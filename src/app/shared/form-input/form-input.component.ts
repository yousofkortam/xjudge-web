import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-form-input',
  templateUrl: './form-input.component.html',
  styleUrls: ['./form-input.component.css']
})
export class FormInputComponent {
  @Input() controller!: FormControl;
  @Input() span!: string;
  @Input() inputType: string = 'text'; // default to text
  
  ngOnInit() {
    console.log(this.controller);
  }
}
