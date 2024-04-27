import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormInputComponent } from './form-input/form-input.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [FormInputComponent],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [FormInputComponent],
})
export class SharedModule { }
