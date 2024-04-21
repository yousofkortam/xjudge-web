import { Component, HostBinding } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title: string = 'xjudge';

  @HostBinding('style.background') background?: string;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
  
  }

  ngOnInit(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.changeBackgroundColor();
      });
  } 
  
  changeBackgroundColor(): void {
    const currentRoute = this.activatedRoute.snapshot.firstChild?.routeConfig?.path;
    const body = document.getElementsByTagName('body')[0];
  
    if (currentRoute == 'login'  ) {
      body.style.backgroundColor = '#373737 '; 
    }
    else if(currentRoute == 'register'){
      body.style.backgroundColor = 'linear-gradient(-150deg, #222222 15%, #373737 70%, #3c4859 94%) ';    
    }
    else if(currentRoute == 'forgetPassword'){
      body.style.backgroundColor = 'linear-gradient(-150deg, #222222 15%, #373737 70%, #3c4859 94%) ';      
    } 
    else {
      body.style.backgroundColor = '#ebebeb';
    }
  }
  
}