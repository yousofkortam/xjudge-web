import { Component, Input, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContestService } from 'src/app/ApiServices/contest.service';
import { ContestDetailsComponent } from '../contest-details/contest-details.component';

@Component({
  selector: 'app-problem-selector-hashtag',
  templateUrl: './problem-selector-hashtag.component.html',
  styleUrls: ['./problem-selector-hashtag.component.css']
})
export class ProblemSelectorHashtagComponent {

  Problems: any = [];
  contestId!: number ;
 
  propHashtag:any
  contest:any = []
   // contest problem
   @ViewChild(ContestDetailsComponent) contestDetails !: ContestDetailsComponent;
    
     ngAfterViewInit(){
     this.contest= this.contestDetails.contest
     this.propHashtag = this.contestDetails.contest.problemHashtag
   console.log(this.contest)
   console.log(this.propHashtag)
  
     }
  
   

  constructor(
    private _Router:Router,
    private _ContestService: ContestService,
    private _ActivatedRoute: ActivatedRoute) { }
 

  
  

}
