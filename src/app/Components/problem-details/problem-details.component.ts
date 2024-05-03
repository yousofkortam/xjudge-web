import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProblemService } from 'src/app/ApiServices/problem.service';
import { DOCUMENT } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { SubmitProblemComponent } from '../submit-problem/submit-problem.component';
import { SubmissionService } from 'src/app/ApiServices/submission.service';
import { AuthService } from 'src/app/ApiServices/auth.service';


@Component({
  selector: 'app-problem-details',
  templateUrl: './problem-details.component.html',
  styleUrls: ['./problem-details.component.css']
})
export class ProblemDetailsComponent implements OnInit {

  source: any;
  problemCode: any;
  problemInfo: any = null;
  problemSumbissions: any = [];
  totalSubmissions: number = 0;
  samples: any = [];
  isLoading: boolean = false;
  apiError: string = '';
  title: string = '';

  constructor(
    private _ProblemService: ProblemService,
    private _ActivatedRoute: ActivatedRoute,
    private submissionService: SubmissionService,
    private authService: AuthService,
    private renderer: Renderer2,
    private titleService: Title,
    private dialog: MatDialog,
    @Inject(DOCUMENT) private document: Document) { }

  fetchEndPointToGetSpecificProblem() {
    this._ProblemService.getSpecificProblem(this.source, this.problemCode).subscribe({
      next: (response) => {
        if (response.success === true) {
          this.problemInfo = response.data
          this.titleService.setTitle(this.problemInfo.title);
          this.samples = response.data.samples
        }
      },
      error: (err) => {
        console.log(err);
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

  ngOnInit(): void {
    this.loadMathJaxConfig();
    this._ActivatedRoute.paramMap.subscribe((param) => {
      this.source = param.get('source');
      this.problemCode = param.get('problemCode');
    });
    this.fetchEndPointToGetSpecificProblem();
    this.loadMathJax();
    this.getProblemSubissions();
  }

  loadMathJaxConfig() {
    let script = this.renderer.createElement('script');
    script.type = 'text/x-mathjax-config';
    script.text = `
      MathJax.Hub.Config({
        tex2jax: {inlineMath: [['$$$','$$$']], displayMath: [['$$$$$$','$$$$$$']]}
      });
    `;
    this.renderer.appendChild(this.document.head, script);
  }

  loadMathJax() {
    let script = this.renderer.createElement('script');
    script.type = 'text/javascript';
    script.async = false;
    script.src = 'https://mathjax.codeforces.org/MathJax.js?config=TeX-AMS_HTML-full';
    this.renderer.appendChild(this.document.head, script);
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

}