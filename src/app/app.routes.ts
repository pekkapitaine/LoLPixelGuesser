import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'game/:difficulty',
    loadComponent: () => import('./features/game/game.component').then(m => m.GameComponent),
  },
  {
    path: 'challenge',
    loadComponent: () => import('./features/challenge/challenge.component').then(m => m.ChallengeComponent),
  },
  {
    path: 'challenge/item',
    loadComponent: () => import('./features/challenge/item-game/item-game.component').then(m => m.ItemGameComponent),
  },
  { path: '**', redirectTo: '' },
];
