import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ContestService } from 'src/app/ApiServices/contest.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css'],
})
export class OverviewComponent implements OnInit {
  [x: string]: any;

  loading: boolean = false;
  problemSet: any = [];
  statistic!: number;
  contestId: any;
  contests: any;

  constructor(
    private _ContestService: ContestService,
    private titleService: Title,
    private _ActivatedRoute: ActivatedRoute
  ) {}

  trackByProblemCode(index: number, problem: any): string {
    return problem.problemCode; // Assuming problemCode is unique
  }
  ngOnInit(): void {
    this._ActivatedRoute.paramMap.subscribe((param) => {
      this.contestId = param.get('contestId');
    });
    this.getContestDetails();
  }

  getContestDetails() {
    this._ContestService.getSpecificContestById(this.contestId).subscribe({
      next: (response) => {
        console.log(response);
        this.contests = response.data;
        this.titleService.setTitle(this.contests.title);
        this.problemSet = response.data.problemSet;
       if (this.problemSet.numberOfAccepted !== 0) {
          this.statistic =this.problemSet.numberOfSubmission / this.problemSet.numberOfAccepted;
        } else {
          this.statistic = 0;
        }
        console.log(this.statistic);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  // getProblemsOfContest(){
  //   this._ContestService.getAllContestProblems(this.contestId).subscribe({
  //     next: (response) =>{
  //       console.log(response)

  //     }
  //   })
  // }
}
