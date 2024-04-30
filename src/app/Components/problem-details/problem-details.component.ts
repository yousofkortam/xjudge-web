import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProblemService } from 'src/app/ApiServices/problem.service';
import { DOCUMENT } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { SubmitProblemComponent } from '../submit-problem/submit-problem.component';


@Component({
  selector: 'app-problem-details',
  templateUrl: './problem-details.component.html',
  styleUrls: ['./problem-details.component.css']
})
export class ProblemDetailsComponent implements OnInit {

  source: any;
  problemCode: any;
  problemInfo: any = null;
  samples: any = [];
  isLoading: boolean = false;
  apiError: string = '';
  title: string = '';

  submitProblemForm: FormGroup = new FormGroup({
    language: new FormControl(null, [Validators.required]),
    solution: new FormControl(null, [Validators.required]),
  });

  constructor(
    private _ProblemService: ProblemService,
    private _ActivatedRoute: ActivatedRoute,
    private renderer: Renderer2,
    private titleService: Title,
    private dialog: MatDialog,
    @Inject(DOCUMENT) private document: Document) { }

  fetchEndPointToGetSpecificProblem() {
    this._ProblemService.getSpecificProblem(this.source, this.problemCode).subscribe({

      next: (response) => {
        console.log(response);
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

}