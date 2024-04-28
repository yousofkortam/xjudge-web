import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { ContestService } from 'src/app/ApiServices/contest.service';

@Component({
  selector: 'app-contest',
  templateUrl: './contest.component.html',
  styleUrls: ['./contest.component.css']
})
export class ContestComponent implements OnInit {
duration:any
  loading: boolean = false;
  Contests: any = [];
  totalPages: number = 0;
  pageSize: number = 25;
  pageNo: number = 0;
  searchPageNumber: number = 0;

  constructor(private _ContestService: ContestService,
    private _ActivatedRoute: ActivatedRoute,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document) { }

  ngOnInit(): void {
    this.getAllContests();
  }
  // calculateHoursFromDuration(duration: string): number {
  //   // Extract the hours from the duration string
  //   const hours = parseInt(duration.substring(2, duration.indexOf('H')));

  //   return hours;
  // }

  trackByContestId(index: number, contest: any): string {
   return contest.id; // Assuming problemCode is unique
   
  }


  getAllContests() {
    this.loading = true;
    this._ContestService.getAllContests(this.pageSize).subscribe({
      next: (response) => {
        console.log(response)
        if (response.success === true) {
          this.loading = false;
          this.Contests = response.data.content;
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
    this.getAllContests();
  }

  searchByTitle(title: String) {
    if (title === '' || title === null || title === undefined) return this.getAllContests();
    this._ContestService.searchContestByTitle(title, this.pageSize, this.searchPageNumber).subscribe({
      next: (response: any) => {
        if (response.success === true) {
          this.Contests = response.data.paginatedData;
          this.totalPages = response.data.totalPages;
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
  

  searchByOwner(owner: String) {
    if (owner === '' || owner === null || owner === undefined) return this.getAllContests();
    this._ContestService.searchContestByTitle(owner, this.pageSize, this.searchPageNumber).subscribe({
      next: (response: any) => {
        if (response.success === true) {
          this.Contests = response.data.paginatedData;
          this.totalPages = response.data.totalPages;
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
}
