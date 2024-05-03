import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  userHandle: any;
  
  constructor(private _ActivatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this._ActivatedRoute.paramMap.subscribe((param) => {
      this.userHandle = param.get('handle');
    });
  }

}
