import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { get } from 'jquery';
import { ContestService } from 'src/app/ApiServices/contest.service';

@Component({
  selector: 'app-contest-details',
  templateUrl: './contest-details.component.html',
  styleUrls: ['./contest-details.component.css']
})
export class ContestDetailsComponent implements OnInit {

  contestId: any;
  contest: any;

  constructor(
    private titleService: Title,
    private _ActivatedRoute: ActivatedRoute,
    private contestService: ContestService) { }

  ngOnInit(): void {
    this.titleService.setTitle('Contesst Details');
    this._ActivatedRoute.paramMap.subscribe((param) => {
      this.contestId = param.get('contestId');
    });
    this.getContestDetails();
  }


  getContestDetails() {
    this.contestService.getSpecificContestById(this.contestId).subscribe({
      next: (response) => {
        console.log(response);
        this.contest = response.data;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

}
