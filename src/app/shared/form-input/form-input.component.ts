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
  
  ngOnInit() {
    console.log(this.controller);
  }
}
