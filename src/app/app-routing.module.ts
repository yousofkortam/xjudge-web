import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './Components/home/home.component';
import { NotFoundComponent } from './Components/not-found/not-found.component';

/**
 * Everything except the shell, the landing page and the 404 is code-split, so a
 * first visit downloads the home page rather than every screen in the app.
 */
const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, title: 'X-Judge' },

  {
    path: 'problem',
    loadChildren: () => import('./features/problems/problems.module').then(m => m.ProblemsModule),
  },
  {
    path: 'status',
    loadChildren: () => import('./features/status/status.module').then(m => m.StatusModule),
  },
  {
    path: 'contest',
    loadChildren: () => import('./features/contests/contests.module').then(m => m.ContestsModule),
  },
  {
    path: 'group',
    loadChildren: () => import('./features/groups/groups-feature.module').then(m => m.GroupsFeatureModule),
  },
  {
    path: '',
    loadChildren: () => import('./features/account/account.module').then(m => m.AccountModule),
  },

  // Legacy aliases kept so older links keep resolving.
  { path: 'allGroups', redirectTo: 'group/exploreGroups', pathMatch: 'full' },
  { path: 'myGroups', redirectTo: 'group/myGroups', pathMatch: 'full' },
  { path: 'create-group', redirectTo: 'group/create', pathMatch: 'full' },

  { path: 'notFound', component: NotFoundComponent, title: 'Page not found · X-Judge' },
  { path: '**', component: NotFoundComponent, title: 'Page not found · X-Judge' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    // The app moves focus and scroll itself on NavigationEnd; the router's own
    // restoration would fight it.
    scrollPositionRestoration: 'disabled',
    anchorScrolling: 'enabled',
    // Feature chunks are fetched once the app is idle, so navigating to
    // Problems or Contests feels instant without costing anything at startup.
    preloadingStrategy: undefined,
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
