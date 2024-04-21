import { Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ProblemService } from 'src/app/ApiServices/problem.service';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent {

  //change title method => problem method
  loading: boolean = false;
  status: any = [];
  totalPages: number = 0;
  pageSize: number = 25;
  pageNo: number = 0;
  searchPageNumber: number = 0;

  constructor(private _problemService: ProblemService) { }
  getAllStatus() {
    this.loading = true;
    this._problemService.getAllProblems(this.pageSize, this.pageNo).subscribe({
      next: (response) => {
        if (response.success === true) {
          this.loading = false;
          this.status = response.data.paginatedData;
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
    this.getAllStatus();
  }

  searchByCode(code: String) {
    if (code === '' || code === null || code === undefined) return this.getAllStatus();
    this._problemService.searchByCode(code, this.pageSize, this.searchPageNumber).subscribe({
      next: (response: any) => {
        if (response.success === true) {
          this.status = response.data.paginatedData;
          this.totalPages = response.data.totalPages;
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  searchByUsername(username: String) {
    if (username === '' || username === null || username === undefined) return this.getAllStatus();
    this._problemService.searchByTitle(username, this.pageSize, this.searchPageNumber).subscribe({
      next: (response: any) => {
        if (response.success === true) {
          this.status = response.data.paginatedData;
          this.totalPages = response.data.totalPages;
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
  ngOnInit(): void {
    this.getAllStatus();
  }

}
