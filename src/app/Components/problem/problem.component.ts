import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Title } from '@angular/platform-browser';
import { OnlineJudgeService } from 'src/app/ApiServices/online-judge.service';
import { ProblemService } from 'src/app/ApiServices/problem.service';

@Component({
  selector: 'app-problem',
  templateUrl: './problem.component.html',
  styleUrls: ['./problem.component.css']
})
export class ProblemComponent implements OnInit {

  loading: boolean = false;
  Problems: any = [];
  totalPages: number = 0;
  totalElements: number = 0;
  pageSize: number = 25;
  pageNo: number = 0;

  onlineJudges: any = [];

  SolvedAttemptedProblemsCount: any = { solved: 0, attempted: 0 };

  oj: string = '';
  problemCode: string = '';
  title: string = '';
  contestName: string = '';

  constructor(
    private _problemService: ProblemService,
    private onlineJudgeService: OnlineJudgeService,
    private titleService: Title) { }

  ngOnInit(): void {
    this.getOnlineJudges();
    this.titleService.setTitle('Problems');
    this.filterProblems();
    this.SolvedAttemptedProblemsCount = this.getSolvedAttemptedProblemsCount();
  }

  trackByProblemCode(index: number, problem: any): string {
    return problem.problemCode; // Assuming problemCode is unique
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageNo = event.pageIndex;
    this.filterProblems();
  }

  onEnterPress() {
    this.filterProblems();
  }

  filterProblems() {
    this.loading = true;
    this._problemService.filterProblem(this.oj, this.problemCode, this.title, this.contestName, this.pageSize, this.pageNo).subscribe({
      next: (response) => {
        console.log(response);
        if (response.success === true) {
          this.loading = false;
          this.Problems = response.data.content;
          this.totalPages = response.data.totalPages;
          this.pageNo = response.data.pageable.pageNumber;
          this.totalElements = response.data.totalElements;
        }
      },
      error: (error) => {
        this.loading = false;
        console.log(error);
      }
    });
  }

  resetFilters() {
    this.oj = '';
    this.problemCode = '';
    this.title = '';
    this.contestName = '';
    this.filterProblems();
  }

  getSolvedAttemptedProblemsCount() {
    return {
      solved: this.Problems.filter((problem: any) => problem.solved === true).length,
      attempted: this.Problems.filter((problem: any) => problem.solved === false).length
    }
  }

  getOnlineJudges() {
    this.onlineJudgeService.getOnlineJudges().subscribe({
      next: (response) => {
        console.log(response);
        if (response.success === true) {
          this.onlineJudges = response.data;
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

}
