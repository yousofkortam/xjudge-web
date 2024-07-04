import { Component, Inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl, Title } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { DOCUMENT } from '@angular/common';
import { SubmitProblemComponent } from '../submit-problem/submit-problem.component';
import { SubmitResultComponent } from '../submit-result/submit-result.component';
import { AuthService } from 'src/app/ApiServices/auth.service';
import { ProblemService } from 'src/app/ApiServices/problem.service';
import { SubmissionService } from 'src/app/ApiServices/submission.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-problem-details',
  templateUrl: './problem-details.component.html',
  styleUrls: ['./problem-details.component.css']
})
export class ProblemDetailsComponent implements OnInit {

  @Input() inContest: boolean = false;

  source: any;
  problemCode: any;
  problemInfo: any = Object;
  problemSumbissions: any = [];
  totalSubmissions: number = 0;
  isLoading: boolean = false;
  apiError: string = '';
  title: string = '';

  descriptionUrl: SafeResourceUrl = '';

  // contest problem
  contestId: any;
  hashTag: any;
  // showButtons: boolean = true;

  submitProblemForm: FormGroup = new FormGroup({
    language: new FormControl(null, [Validators.required]),
    solution: new FormControl(null, [Validators.required]),
  });

  constructor(
    private _Router: Router,
    private _ProblemService: ProblemService,
    private _ActivatedRoute: ActivatedRoute,
    private submissionService: SubmissionService,
    private authService: AuthService,
    private titleService: Title,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer,
    @Inject(DOCUMENT) private document: Document) { }

  ngOnInit(): void {
    if (this.inContest) {
      this._ActivatedRoute.paramMap.subscribe((param) => {
        this.contestId = param.get('contestId');
        this.hashTag = param.get('hashTag');
      });
    } else {
      this._ActivatedRoute.paramMap.subscribe((param) => {
        this.source = param.get('source');
        this.problemCode = param.get('problemCode');
      });
    }
    this.getSpecificProblem();
    this.getProblemSubissions();
  }

  openModal() {
    this.dialog.open(SubmitProblemComponent, {
      data: {
        problemCode: this.problemCode,
        source: this.source,
        inContest: this.inContest ,
        contestId : this.contestId ,
      },
      width: '60%',
      height: 'auto',
      disableClose: true
    },
    );
}

  openSubmitProblemModal() {
    this.dialog.open(SubmitProblemComponent, {
      data: {
        problemCode: this.problemCode,
        source: this.source,
      },
      width: '60%',
      height: 'auto',
      disableClose: true
    });
  }

  getSpecificProblem() {
    const observable = this.inContest
      ? this._ProblemService.getSpecificProblemByHashTagForContest(this.contestId, this.hashTag)
      : this._ProblemService.getSpecificProblem(this.source, this.problemCode);

    observable.subscribe({
      next: (response) => {
        if (response.success === true) {
          this.problemCode = response.data.code;
          this.problemInfo = response.data;
          console.log(this.problemInfo);
          this.source = this.problemInfo.onlineJudge;
          this.titleService.setTitle(this.problemInfo.title);
          this.descriptionUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`http://localhost:7070${this.problemInfo.discriptionRoute}`);
        }
      },
      error: (err) => {
        if (err.error.error.statusCode == 404) {
          this._Router.navigate(['/notFound']);
        }
      }
    });
  }

  getProblemSubissions() {
    this.isLoading = true;
    this.submissionService.filterSubmissions(this.authService.getUserHandle(), '', this.problemCode, '', 2, 0).subscribe({
      next: (response) => {
        if (response.success === true) {
          this.isLoading = false;
          this.problemSumbissions = response.data.content;
          this.totalSubmissions = response.data.totalElements;
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.log(error);
      }
    });
  }

  showSubmissionResult(id: number) {
    this.dialog.open(SubmitResultComponent, {
      data: {
        submit: false,
        submissionId: id
      },
      width: '70%',
      height: 'auto'
    });
  }

  recrawl() {
    window.location.reload();
  }
  
}
