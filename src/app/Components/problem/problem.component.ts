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
  pageSize: number = 25;
  pageNo: number = 0;
  searchPageNumber: number = 0;

  constructor(
    private _problemService: ProblemService,
    private titleService: Title) { }

  ngOnInit(): void {
    this.titleService.setTitle('Problem');
    this.getAllProblems();
  }

  getAllProblems() {
    this.loading = true;
    this._problemService.getAllProblems(this.pageSize, this.pageNo).subscribe({
      next: (response) => {
        if (response.success === true) {
          this.loading = false;
          this.Problems = response.data.paginatedData;
          this.totalPages = response.data.totalPages;
        }
      },
      error: (error) => {
        this.loading = false;
        console.log(error);
      }
    });
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageNo = event.pageIndex;
    this.getAllProblems();
  }

  searchByCode(code: String) {
    if (code === '' || code === null || code === undefined) return this.getAllProblems();
    this._problemService.searchByCode(code, this.pageSize, this.searchPageNumber).subscribe({
      next: (response: any) => {
        if (response.success === true) {
          this.Problems = response.data.paginatedData;
          this.totalPages = response.data.totalPages;
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  searchByTitle(title: String) {
    if (title === '' || title === null || title === undefined) return this.getAllProblems();
    this._problemService.searchByTitle(title, this.pageSize, this.searchPageNumber).subscribe({
      next: (response: any) => {
        if (response.success === true) {
          this.Problems = response.data.paginatedData;
          this.totalPages = response.data.totalPages;
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

}
