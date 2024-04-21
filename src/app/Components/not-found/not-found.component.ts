import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent implements OnInit {
  imageNotFound: string = "./assets/images/error-404.png";

  constructor(private titleService: Title) {}

  ngOnInit(): void {
    this.titleService.setTitle('Not Found');
  }

}
