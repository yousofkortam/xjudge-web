import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-submit-result',
  templateUrl: './submit-result.component.html',
  styleUrls: ['./submit-result.component.css']
})
export class SubmitResultComponent {

  @Input() data: any = {};

}
