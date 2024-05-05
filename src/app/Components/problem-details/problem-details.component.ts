import { Component, Inject, Injectable, OnInit, Renderer2 } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
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

@Injectable({
  providedIn: 'root'
})

export class ProblemDetailsComponent implements OnInit {

  source: any;
  problemCode: any;
  problemInfo: any = null;
  samples: any = [];
  isLoading: boolean = false;
  apiError: string = '';
  title: string = '';
 
  showButtons: boolean = true;
  
  submitProblemForm: FormGroup = new FormGroup({
    language: new FormControl(null, [Validators.required]),
    solution: new FormControl(null, [Validators.required]),
  });

  constructor(
    private _Router:Router,
    private _ProblemService: ProblemService,
    private _ActivatedRoute: ActivatedRoute,
    private renderer: Renderer2,
    private titleService: Title,
    private dialog: MatDialog,
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
  getSpecificProblem() {
    this._ProblemService.getSpecificProblem(this.source, this.problemCode).subscribe({

      next: (response) => {
        console.log(response);
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
    this.getSpecificProblem();
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
  refreshPage() {
    // Navigate to the same route (refresh the component)
    this._Router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this._Router.navigate(['']);
      console.log("hi ya soker")
    });
  }
}