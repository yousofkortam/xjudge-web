import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ContestService } from 'src/app/ApiServices/contest.service';

@Component({
  selector: 'app-create-contest',
  templateUrl: './create-contest.component.html',
  styleUrls: ['./create-contest.component.css']
})
export class CreateContestComponent {

  isLoading:boolean = false;
  apiError:string = '';
  
  createContestForm: FormGroup = new FormGroup({
    title:new FormControl(null, [Validators.required]),
    durationSeconds:new FormControl(null, [Validators.required ]),
    type:new FormControl(null, [Validators.required ]),
    visibility:new FormControl(null, [Validators.required ]),
    beginTime:new FormControl(null, [Validators.required ]),
    problems:new FormControl(null, [Validators.required ]),
    groupId :new FormControl(null, [Validators.required ]),
    password :new FormControl(null, [Validators.required ]),
    description :new FormControl(null, [Validators.required ]),
  });
 
  constructor(private _ContestService: ContestService , private _Router: Router) {}


  handleSubmitProblem(createContestForm:FormGroup){
    this.isLoading = true;
    if(createContestForm.valid){
      this._ContestService.createContest().subscribe({
        next: (response)=> {
          if (response.success === true) {
            localStorage.setItem('userToken', response.token);
            this._Router.navigate(['/contest']);
            this.isLoading= false;
          }
        },
        error: (err)=> {
          this.isLoading = false;
          this.apiError = err.error.message;
        }
      });
    }
  }

}

