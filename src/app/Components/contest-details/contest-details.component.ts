import { Component, OnInit, HostListener, Inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { interval } from 'rxjs';
import { AuthService } from 'src/app/ApiServices/auth.service';
import { ContestService } from 'src/app/ApiServices/contest.service';
import { ProblemService } from 'src/app/ApiServices/problem.service';
import { UpdateContestComponent } from '../update-contest/update-contest.component';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-contest-details',
  templateUrl: './contest-details.component.html',
  styleUrls: ['./contest-details.component.css']
})
export class ContestDetailsComponent implements OnInit {
  loading: boolean = false;
  problemSet: any = [];   
  contestId: any;
  contest: any;
  selectedButton: string = 'overview';
  problemInfo: any = {};
  problemHashtag: any;

  progressBarValue: number = 0;
  countdownTimer: string = '';
  isLeaderOrManager: boolean = false;

  constructor(
    private titleService: Title, 
    private _ActivatedRoute: ActivatedRoute, 
    private contestService: ContestService ,
    private _ProblemService: ProblemService,
    private authService: AuthService,
    private dialog: MatDialog ) {}

  ngOnInit(): void {
    this._ActivatedRoute.paramMap.subscribe((param) => {
      this.contestId = param.get('contestId');
    });
    this.getContestDetails();
    interval(1000).subscribe(() => {
      this.updateProgressBar();
      this.updateCountdownTimer();
      if (this.contest.contestStatus === 'RUNNING') {
        // this.checkActiveTabAndPrintUrl();
      }
    });
    // document.addEventListener('visibilitychange', this.onVisibilityChange.bind(this));
  }

  ngOnDestroy(): void {
    // document.removeEventListener('visibilitychange', this.onVisibilityChange.bind(this));
  }

  getContestDetails() {
    this.contestService.getSpecificContestById(this.contestId).subscribe({
      next: (response) => {
        this.contest = response.data;
        this.isLeaderOrManager = this.authService.getUserHandle() === this.contest.ownerHandle;
        this.titleService.setTitle(this.contest.title);
        this.problemSet = response.data.problemSet;
        this.problemSet.sort((a: any, b: any) => a.problemHashtag.localeCompare(b.problemHashtag));
        this.updateProgressBar();
        this.updateCountdownTimer();
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  getProblemDetailsWithHashtag(problemHashtag: string) {
    this._ProblemService.getSpecificProblemDetailsByHashtag(this.contestId, problemHashtag).subscribe({
      next: (response) => {
        this.problemInfo = response.data;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  onBtnClick(button: string) {
    this.selectedButton = button;
    if (button === 'problem' && this.problemSet.length > 0) {
      this.getProblemDetailsWithHashtag(this.problemSet[0].problemHashtag);
    }
  }

  updateProgressBar() {
    if (this.contest) {
      const currentTime = new Date().getTime();
      const beginTime = this.contest.beginTime * 1000;
      const endTime = this.contest.endTime * 1000;
      const elapsedTime = currentTime - beginTime;
      const totalTime = endTime - beginTime;
      this.progressBarValue = (elapsedTime / totalTime) * 100;
    }
  }

  updateCountdownTimer() {
    if (this.contest) {
      const currentTime = new Date().getTime();
      const beginTime = this.contest.beginTime * 1000;
      const endTime = this.contest.endTime * 1000;
      let remainingTime;

      if (currentTime < beginTime) {
        this.contest.contestStatus = 'SCHEDULED';
        remainingTime = beginTime - currentTime;
      } else if (currentTime < endTime) {
        this.contest.contestStatus = 'RUNNING';
        remainingTime = endTime - currentTime;
      } else {
        this.contest.contestStatus = 'ENDED';
        return;
      }

      const seconds = Math.floor(remainingTime / 1000) % 60;
      const minutes = Math.floor(remainingTime / (1000 * 60)) % 60;
      const hours = Math.floor(remainingTime / (1000 * 60 * 60)) % 24;
      const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));

      if (days > 0) {
        this.countdownTimer = `${days.toString().padStart(2, '0')} : ${hours.toString().padStart(2, '0')} : ${minutes.toString().padStart(2, '0')} : ${seconds.toString().padStart(2, '0')}`;
      } else if (hours > 0) {
        this.countdownTimer = `${hours.toString().padStart(2, '0')} : ${minutes.toString().padStart(2, '0')} : ${seconds.toString().padStart(2, '0')}`;
      } else {
        this.countdownTimer = `${minutes.toString().padStart(2, '0')} : ${seconds.toString().padStart(2, '0')}`;
      }
    }
  }

  // onVisibilityChange() {
  //   if (document.visibilityState === 'visible' && this.contest?.contestStatus === 'RUNNING') {
  //     this.printCurrentUrl();
  //   }
  // }

  // checkActiveTabAndPrintUrl() {
  //   if (document.visibilityState === 'visible') {
  //     console.log('Tab is active');
  //     this.printCurrentUrl();
  //   } else {
  //     this.printCurrentUrl();
  //     console.log('Tab is inactive');
  //      this.printCurrentUrl();
  //   }
  // }

  // printCurrentUrl() {
  //   console.log('Current URL:', window.location.href);
  // }

  openUpdateContestDialog() {
    this.dialog.open(UpdateContestComponent, {
      data: {
        contest: this.contest,
        problemSet: this.problemSet
       
      },
      width: '65%',
      height: 'auto',
      disableClose: true
    }); 
       console.log(this.contest);   
       console.log(this.problemSet);   
  }
  
}
