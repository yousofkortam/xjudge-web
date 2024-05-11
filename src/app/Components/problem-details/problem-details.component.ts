import { Component, Inject, Injectable, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ProblemService } from 'src/app/ApiServices/problem.service';
import { DOCUMENT } from '@angular/common';
import { DomSanitizer, SafeResourceUrl, Title } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { SubmitProblemComponent } from '../submit-problem/submit-problem.component';
import { SubmissionService } from 'src/app/ApiServices/submission.service';
import { AuthService } from 'src/app/ApiServices/auth.service';
import { SubmitResultComponent } from '../submit-result/submit-result.component';
import { ContestDetailsComponent } from '../contest-details/contest-details.component';

@Component({
  selector: 'app-problem-details',
  templateUrl: './problem-details.component.html',
  styleUrls: ['./problem-details.component.css']
})

@Injectable({
  providedIn: 'root'
})

export class ProblemDetailsComponent implements OnInit {

  source: any;
  problemCode: any;
  problemInfo: any = Object;
  problemSumbissions: any = [];
  totalSubmissions: number = 0;
  samples: any = [];
  isLoading: boolean = false;
  apiError: string = '';
  title: string = '';

  descriptionUrl: SafeResourceUrl = '';
 
  // contest problem

  
  contestId:any
  showButtons: boolean = true;
  
  @ViewChild(ContestDetailsComponent) problemSet!: ContestDetailsComponent;

  
  submitProblemForm: FormGroup = new FormGroup({
    language: new FormControl(null, [Validators.required]),
    solution: new FormControl(null, [Validators.required]),
  });

  constructor(
    private _Router:Router,
    private _ProblemService: ProblemService,
    private _ActivatedRoute: ActivatedRoute,
    private submissionService: SubmissionService,
    private authService: AuthService,
    private renderer: Renderer2,
    private titleService: Title,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer,
    @Inject(DOCUMENT) private document: Document) {

      this._Router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.checkUrl(event.url);
        }
      });
     }
  
     private checkUrl(url: string): void {
      if (url.includes('/problem')) {
        this.showButtons = false;
      } else {
        this.showButtons = true;
      }
    }

  ngOnInit(): void {
    console.log(this.problemSet.problemHashtag)

    this._ActivatedRoute.paramMap.subscribe((param) => {
      this.source = param.get('source');
      this.problemCode = param.get('problemCode');

    });
    this.descriptionUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`http://localhost:7070/description/${this.source}-${this.problemCode}`);
    console.log(this.descriptionUrl);
    
    this.getSpecificProblem();
    this.getProblemSubissions();
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

getSpecificProblem() {
    this._ProblemService.getSpecificProblem(this.source, this.problemCode).subscribe({
      next: (response) => {
        if (response.success === true) {
          this.problemInfo = response.data
          this.titleService.setTitle(this.problemInfo.title);
          this.samples = response.data.samples;
        }
      },
      error: (err) => {
        console.log(err);
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
          console.log(this.problemSumbissions);
          
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

