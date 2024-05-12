import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContestService } from 'src/app/ApiServices/contest.service';

@Component({
  selector: 'app-problem-selector-hashtag',
  templateUrl: './problem-selector-hashtag.component.html',
  styleUrls: ['./problem-selector-hashtag.component.css']
})
export class ProblemSelectorHashtagComponent {

  Problems: any = [];
  
  contestId!: number ;
 
  
    @Input() problemSet: any = [];

  constructor(
    private _Router:Router,
    private _ContestService: ContestService,
    private _ActivatedRoute: ActivatedRoute) { }
 
  ngOnInit(): void {
    this.getHashtagOfEachProblem()
  }
  
  getHashtagOfEachProblem(){

      this._ContestService.getSpecificContestById(this.contestId).subscribe({
        next: (response) => {
          console.log(response)
          this.problemSet = response.data.problemSet;
          this.problemSet.sort((a: any, b: any) => a.problemHashtag.localeCompare(b.problemHashtag));
         
        },
        error: (err) => {
          console.log(err);
        }
      });
    }
  
  

}
