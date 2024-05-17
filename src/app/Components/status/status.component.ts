import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/ApiServices/auth.service';
import { SubmissionService } from 'src/app/ApiServices/submission.service';
import { SubmitResultComponent } from '../submit-result/submit-result.component';
import { Title } from '@angular/platform-browser';
import { OnlineJudgeService } from 'src/app/ApiServices/online-judge.service';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent implements OnInit {

  submissions: any[] = [];
  totalPages: number = 0;
  totalElements: number = 0;
  pageSize: number = 25;
  pageNo: number = 0;

  onlineJudges: any = [];

  // filter options
  userHandle: string = '';
  oj: string = '';
  problemCode: string = '';
  language: string = '';

  buttons: any = [
    { 'name': 'All', 'style': { 'background-color': '#0275d8', 'color': 'white' }, click: () => this.getAllSubmissions() },
    { 'name': 'Mine', 'style': { 'background-color': 'white', 'color': 'black' }, click: () => this.getMineSubmissions() },
  ];

  constructor(
    private submissionService: SubmissionService,
    private onlineJudgeService: OnlineJudgeService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private titleService: Title,
    private dialog: MatDialog,) { }

  ngOnInit(): void {
    this.getOnlineJudges();
    this.setButtonStyle('All', '#0275d8', 'white');
    this.titleService.setTitle('Status');
    this.filterSubmissions();
  }


  filterSubmissions() {
    this.submissionService.filterSubmissions(this.userHandle, this.oj, this.problemCode, this.language, this.pageSize, this.pageNo).subscribe({
      next: (response) => {
        console.log(response);
        this.submissions = response.data.content;
        this.totalPages = response.data.totalPages;
        this.totalElements = response.data.totalElements;
        this.pageNo = response.data.pageable.pageNumber;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  setButtonStyle(button: string, color: string, textColor: string) {
    for (let btn of this.buttons) {
      if (btn.name === button) {
        btn['style']['background-color'] = color;
        btn['style']['color'] = textColor;
      } else {
        btn['style']['background-color'] = 'white';
        btn['style']['color'] = 'black';
      }
    }
  }

  getAllSubmissions() {
    this.setButtonStyle('All', '#0275d8', 'white');
    this.userHandle = '';
    this.filterSubmissions();
  }

  getMineSubmissions() {
    this.setButtonStyle('Mine', '#0275d8', 'white');
    this.userHandle = this.authService.getUserHandle();
    if (this.userHandle == null) {
      this.snackBar.open('You are not logged in!', 'Close', { duration: 3000 });
      return;
    }
    this.filterSubmissions();
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageNo = event.pageIndex;
    this.filterSubmissions();
  }

  resetFilters() {
    this.userHandle = '';
    this.oj = '';
    this.problemCode = '';
    this.language = '';
    this.setButtonStyle('All', '#0275d8', 'white');
    this.filterSubmissions();
  }

  showSubmissionResult(index: number) {
    this.dialog.open(SubmitResultComponent, {
      data: {
        contestId: index,
        submit: false
      },
      width: '70%',
      height: 'auto'
    });
  }

  getOnlineJudges() {
    this.onlineJudgeService.getOnlineJudges().subscribe({
      next: (response) => {
        this.onlineJudges = response.data;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

}
