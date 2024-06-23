import { Component, Input, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css'],
})
export class OverviewComponent implements OnInit {
  [x: string]: any;
  @Input() problemSet: any = [];
  @Input() shorOrigin: boolean = false;
  @Input() contestId: any;

  constructor(
    private titleService: Title,
  ) {}

  trackByProblemCode(index: number, problem: any): string {
    return problem.problemCode;
  }

  ngOnInit(): void {
    this.titleService.setTitle('Contest Overview');
  }

}
