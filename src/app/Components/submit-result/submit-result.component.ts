import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-submit-result',
  templateUrl: './submit-result.component.html',
  styleUrls: ['./submit-result.component.css']
})
export class SubmitResultComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

}
