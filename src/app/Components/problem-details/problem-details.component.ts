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

@Component({
  selector: 'app-problem-details',
  templateUrl: './problem-details.component.html',
  styleUrls: ['./problem-details.component.css']
})
export class ProblemDetailsComponent implements OnInit {
  @Input() problemSet: any = [];
  @Input() problemInfo: any = {};
  @Input() shorOrigin: boolean = false;
  @Input() contestId: any;
  source: any;
  problemCode: any;
  problemSumbissions: any = [];
  totalSubmissions: number = 0;
  samples: any = [];
  descriptionUrl: SafeResourceUrl = '';
  showButtons: boolean = true;
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private problemService: ProblemService,
    private route: ActivatedRoute,
    private submissionService: SubmissionService,
    private authService: AuthService,
    private sanitizer: DomSanitizer,
    private titleService: Title,
    private dialog: MatDialog,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((param) => {
      const source = param.get('source');
      const problemCode = param.get('problemCode');
      const contestId = param.get('contestId');
      if (source && problemCode && contestId ) {
        this.descriptionUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`http://localhost:7070/description/${source}-${problemCode}`);
        this.getSpecificProblem(source, problemCode);
        this.getProblemSubmissions(source, problemCode);
        console.log(this.contestId)
        this.contestId = contestId;
      }
    });
  }
   
  openModal() {
    this.dialog.open(SubmitProblemComponent, {
      data: {
        problemCode: this.problemCode,
        source: this.source,
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

  getProblemDetailsFromContest(problemHashtag: string){
    if (this.contestId) {
      this.getSpecificProblemDetailsByHashtag(this.contestId, problemHashtag);
      console.log(this.contestId)
    }
  }
 
  getSpecificProblemDetailsByHashtag(contestId: string, problemHashtag: string){ 
    console.log("lol")
    console.log(this.contestId)
    this.problemService.getSpecificProblemDetailsByHashtag(this.contestId, problemHashtag).subscribe({     
     next: (response) => {      
        if (response.success === true) {
          this.problemInfo = response.data;
          this.samples = response.data.samples;
        }
      },
      error: (err) => {
        console.error(err);
      }
   
    }); 
  }

  getSpecificProblem(source: string, problemCode: string) {
    this.problemService.getSpecificProblem(source, problemCode).subscribe({
      next: (response) => {
        if (response.success === true) {
          this.problemInfo = response.data;
          this.titleService.setTitle(this.problemInfo.title);
          this.samples = response.data.samples;
        }
      },
      error: (err) => {
        if (err.error.success === false) {
          this.router.navigate(['/notFound']);
        }
      }
    });
  }

  getProblemSubmissions(source: string, problemCode: string) {
    this.isLoading = true;
    this.submissionService.filterSubmissions(this.authService.getUserHandle(), '', problemCode, '', 2, 0).subscribe({
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

  showSubmissionResult(index: number) {
    this.dialog.open(SubmitResultComponent, {
      data: { 
        response: this.problemSumbissions[index],
        submit: false
      },
      width: '70%',
      height: 'auto'
    });
  }
 
  recrawl() {
    window.location.reload();
  }
}
