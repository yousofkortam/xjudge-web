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
  statistic!: number;
  contestId: any;
  contest: any;
  selectedButton: string = 'overview'; // Track selected button

  // progress bar
  contestBeginTime!: number; // Contest begin time in milliseconds
  contestEndTime!: number; // Contest end time in milliseconds
  duration!: number; // Duration of the contest in seconds
  progressBarValue: number = 0; // Progress bar value
  remainingTime!: number; // Remaining time in milliseconds
  private timerSubscription!: Subscription; // Subscription for timer

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

   
      this.contestBeginTime = this.contest.beginTime * 1000; // Convert to milliseconds
      this.contestEndTime = this.contest.endTime * 1000; // Convert to milliseconds
      this.duration = this.contest.duration; // Contest duration in seconds

      // Set up timer to update progress bar and remaining time every second
      const timer = interval(1000);
      this.timerSubscription = timer.subscribe(() => {
        this.updateProgressBar();
        this.updateRemainingTime();
      });
   
  }

  ngOnDestroy(): void {
    // Unsubscribe from timer to avoid memory leaks
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  // Function to update progress bar value
  updateProgressBar(): void {
    const currentTime = Date.now(); // Current time in milliseconds
    const totalTime = this.contest.endTime - this.contest.beginTime; // Total time in milliseconds
    const elapsedTime = currentTime - this.contest.beginTime; // Elapsed time in milliseconds
    this.progressBarValue = (elapsedTime / totalTime) * 100; // Calculate progress bar value
  }

  // Function to update remaining time
  updateRemainingTime(): void {
    const currentTime = Date.now(); // Current time in milliseconds
    const remainingTimeMs = this.contest.endTime - currentTime; // Remaining time in milliseconds
    this.remainingTime = remainingTimeMs; // Remaining time in milliseconds
  }



   
  

  getContestDetails() {
    this.contestService.getSpecificContestById(this.contestId).subscribe({
      next: (response) => {
        this.contest = response.data;     
        this.titleService.setTitle(this.contest.title);
        this.problemSet = response.data.problemSet;
        // this.statistic = this.problemSet.numberOfSubmission / this.problemSet.numberOfAccepted;
        if (this.problemSet.numberOfAccepted !== 0) {
          this.statistic = this.problemSet.numberOfSubmission / this.problemSet.numberOfAccepted;
        } else {
          this.statistic = 0;
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
}