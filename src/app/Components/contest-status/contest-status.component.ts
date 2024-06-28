import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { AuthService } from 'src/app/ApiServices/auth.service';
import { SubmitResultComponent } from '../submit-result/submit-result.component';
import { ContestService } from 'src/app/ApiServices/contest.service';

@Component({
  selector: 'app-contest-status',
  templateUrl: './contest-status.component.html',
  styleUrls: ['./contest-status.component.css']
})
export class ContestStatusComponent implements OnInit {
  submissions: any[] = [];
  totalPages: number = 0;
  totalElements: number = 0;
  pageSize: number = 25;
  pageNo: number = 0;
  @Input() contestId: number = 0;
  @Input() problemSet: any[] = [];


  // filter options
  userHandle: string = '';
  result: string = '';
  problemCode: string = '';
  language: string = '';

  constructor(
    private contestService: ContestService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private titleService: Title,
    private dialog: MatDialog,) { }

  ngOnInit(): void {
    this.titleService.setTitle('Status');
    this.filterSubmissions();
  }


  filterSubmissions() {
    this.contestService.filterSubmissionsInContest(this.contestId, this.userHandle, this.problemCode, this.result, this.language, this.pageSize, this.pageNo).subscribe({
      next: (response) => {
        console.log(response);
        this.submissions = response.content;
        this.totalPages = response.totalPages;
        this.totalElements = response.totalElements;
        this.pageNo = response.pageable.pageNumber;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }


  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageNo = event.pageIndex;
    this.filterSubmissions();
  }

  resetFilters() {
    this.userHandle = '';
    this.result = '';
    this.problemCode = '';
    this.language = '';
    this.filterSubmissions();
  }

  showSubmissionResult(index: number) {
    this.dialog.open(SubmitResultComponent, {
      data: {
        submissionId: index,
        submit: false
      },
      width: '70%',
      height: 'auto'
    });
  }
}
