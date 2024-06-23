import { animate } from '@angular/animations';
import { Component, Input, OnInit} from '@angular/core';
import { ContestService } from 'src/app/ApiServices/contest.service';

@Component({
  selector: 'app-contest-rank',
  templateUrl: './contest-rank.component.html',
  styleUrls: ['./contest-rank.component.css']
})
export class ContestRankComponent implements OnInit{

   @Input()problemSet: any = [];
   @Input()contestId: any;
   contestRank: any = [];

   constructor(private contestService: ContestService){
   }

  ngOnInit(): void {
    this.contestService.getContstRank(this.contestId).subscribe({
      next: (response) => {
        this.contestRank = response.data;
        for(let i = 0; i < this.contestRank.length; i++){
          const submissionList = this.getSubmissionsForContestant(this.contestRank[i]);
          this.contestRank[i]["submissionStatus"] = submissionList;
        }
        console.log(response.data)
      },
      error: (err) => {
        console.error('Error fetching contest rank:', err);
      }
    });
  }

  getSubmissionsForContestant(contestant:any){
    let submissionList = [];
    let i = 0 , j = 0;
    while(i < this.problemSet.length && j < contestant.submissionList.length){
      let isAccepted= 0;
      let time = '';
      let attempted= 0;
      let isAttempt= 0;
      if(this.problemSet[i].problemHashtag < contestant.submissionList[j].problemIndex){
        submissionList.push({isAccepted, time, attempted, isAttempt , problemHastag: this.problemSet[i].problemHashtag});
        i++;
      }else if(this.problemSet[i].problemHashtag === contestant.submissionList[j].problemIndex){
        while(j < contestant.submissionList.length && this.problemSet[i].problemHashtag === contestant.submissionList[j].problemIndex){
          if(!isAccepted  && contestant.submissionList[j].status === 'Accepted'){
            isAttempt = 1
            isAccepted = 1;
            time = this.formatTime(contestant.submissionList[j].submitTime);
          }
          else if(contestant.submissionList[j].status !== 'Accepted'){
            attempted++;
            isAttempt = 1;
          }
          j++;
        }
        submissionList.push({isAccepted, time, attempted, isAttempt , problemHastag: this.problemSet[i].problemHashtag});
        i++;
      }
      else{
        j++;
      }
    }
    return submissionList;
  }

  formatTime(time: any){
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${hours}:${minutes}:${seconds}`;
  }

  penaltyInMinute(timeInSecond: any){
    return Math.floor(timeInSecond / 60);
  }
}
