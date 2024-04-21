import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProtectedAuthGuard implements CanActivate {

  constructor(private _Router:Router){};

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

     if(localStorage.getItem('userToken') !==null)
     {
        return true;
     }
     else
     {
        this._Router.navigate(['/login']).then(r => r);
        return false;
     }
  }

}
