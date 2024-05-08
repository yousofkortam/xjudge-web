import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { interval } from 'rxjs';
import { AuthService } from 'src/app/ApiServices/auth.service';

import { ContestService } from 'src/app/ApiServices/contest.service';

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
  progressBarValue: number = 0;
  countdownTimer: string = '';
  isLeaderOrManager: boolean = false;

  problemHashtag:any

  constructor(
    private titleService: Title, 
    private _ActivatedRoute: ActivatedRoute, 
    private contestService: ContestService ,
    private authService: AuthService
  ){}

  ngOnInit(): void {
    this._ActivatedRoute.paramMap.subscribe((param) => {
      this.contestId = param.get('contestId');
    });
    this.getContestDetails();
    interval(1000).subscribe(() => {
      this.updateProgressBar();
      this.updateCountdownTimer();
    });
  }

  getContestDetails() {
    this.contestService.getSpecificContestById(this.contestId).subscribe({
      next: (response) => {
        this.contest = response.data;
        console.log(this.contest);
        this.isLeaderOrManager = this.authService.getUserHandle() === this.contest.ownerHandle;
        this.titleService.setTitle(this.contest.title);
        this.problemSet = response.data.problemSet;
        this.problemSet.sort((a: any, b: any) => a.problemHashtag.localeCompare(b.problemHashtag));
        this.problemHashtag= this.problemSet.problemHashtag
        this.updateProgressBar();
        this.updateCountdownTimer();
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  onBtnClick(button: string) {
    this.selectedButton = button;
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
}
