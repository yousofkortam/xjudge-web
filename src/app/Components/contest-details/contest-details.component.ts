import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription, interval } from 'rxjs';
import { map, takeWhile } from 'rxjs/operators';

import { ContestService } from 'src/app/ApiServices/contest.service';

@Component({
  selector: 'app-contest-details',
  templateUrl: './contest-details.component.html',
  styleUrls: ['./contest-details.component.css']
})
export class ContestDetailsComponent implements OnInit {
  loading: boolean = false;
  problemSet: any = [];   
  statistic: number = 0; 
  contestId: any;
  contest: any;
  selectedButton: string = 'overview'; // Track selected button
  progressBarValue: number = 0;
  countdownTimer: string = '';
  contestStarted: boolean = false; // Variable to track whether contest has started

  constructor(
    private titleService: Title, 
    private _ActivatedRoute: ActivatedRoute, 
    private contestService: ContestService 
  ){}

  ngOnInit(): void {
    this._ActivatedRoute.paramMap.subscribe((param) => {
      this.contestId = param.get('contestId');
    });
    this.getContestDetails();
    // Call function every second
    interval(1000).subscribe(() => {
      this.updateProgressBar();
      this.updateCountdownTimer();
    });
  }

  getContestDetails() {
    this.contestService.getSpecificContestById(this.contestId).subscribe({
      next: (response) => {
        this.contest = response.data;     
        this.titleService.setTitle(this.contest.title);
        this.problemSet = response.data.problemSet;
        // Calculate initial progress
        this.updateProgressBar();
        this.updateCountdownTimer();
        // Calculate statistic
        if (this.problemSet.numberOfAccepted !== undefined && this.problemSet.numberOfAccepted !== null && this.problemSet.numberOfAccepted !== 0) {
          this.statistic = this.problemSet.numberOfSubmission / this.problemSet.numberOfAccepted;
        } else {
          this.statistic = 0;
        }
        // Check if contest has started
        const currentTime = new Date().getTime();
        const beginTime = this.contest.beginTime * 1000;
        if (currentTime >= beginTime) {
          this.contestStarted = true;
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  // Function to handle button clicks
  onBtnClick(button: string) {
    this.selectedButton = button;
  }

  // Function to update progress bar
  updateProgressBar() {
    if (this.contest && !this.contestStarted) { // Update progress only if contest hasn't started
      const currentTime = new Date().getTime();
      const beginTime = this.contest.beginTime * 1000;
      const endTime = this.contest.endTime * 1000;
      const elapsedTime = currentTime - beginTime;
      const totalTime = endTime - beginTime;
      this.progressBarValue = (elapsedTime / totalTime) * 100;
    }
  }

  // Function to update countdown timer
  updateCountdownTimer() {
    if (this.contest && !this.contestStarted) { // Update countdown timer only if contest hasn't started
      const currentTime = new Date().getTime();
      const beginTime = this.contest.beginTime * 1000;
      const remainingTime = beginTime - currentTime;
      if (remainingTime > 0) {
        const seconds = Math.floor(remainingTime / 1000) % 60;
        const minutes = Math.floor(remainingTime / (1000 * 60)) % 60;
        const hours = Math.floor(remainingTime / (1000 * 60 * 60)) % 24;
        const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
        this.countdownTimer = `${days}d ${hours}h ${minutes}m ${seconds}s`;
      } else {
        this.countdownTimer = 'Contest has started';
        this.contestStarted = true;
      }
    }
  }
}
