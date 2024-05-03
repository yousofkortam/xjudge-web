import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Title } from '@angular/platform-browser';
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

  oj: string = '';
  problemCode: string = '';
  title: string = '';
  contestName: string = '';

  constructor(
    private _problemService: ProblemService,
    private titleService: Title) { }

  ngOnInit(): void {
    this.titleService.setTitle('Problem');
    this.filterProblems();
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

}
