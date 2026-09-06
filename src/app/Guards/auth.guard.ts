import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '../ApiServices/auth.service';

/**
 * Blocks a route for signed-out visitors and remembers where they were headed.
 *
 * It returns a UrlTree rather than navigating imperatively so the router
 * cancels the current navigation exactly once — the older `navigate() + false`
 * form can interleave two navigations and leave the outlet empty.
 */
@Injectable({
  providedIn: 'root'
})
export class ProtectedAuthGuard implements CanActivate {

  constructor(private _AuthService: AuthService, private _Router: Router) {}

  canActivate(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    if (this._AuthService.isLogin()) return true;
    return this._Router.createUrlTree(['/login'], {
      queryParams: { returnUrl: state.url },
    });
  }
}
