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
  progressBarValue: number = 0;

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


  // Function to update progress bar
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

}