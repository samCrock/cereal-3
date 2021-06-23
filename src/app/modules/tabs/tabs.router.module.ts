import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'movies',
        children: [
          {
            path: '',
            loadChildren: '../movies/movies.module#MoviesModule'
          }
        ]
      },
      {
        path: 'series',
        children: [
          {
            path: '',
            loadChildren: '../series/series.module#SeriesModule'
          }
        ]
      }
    ]
  },
  // {
  //   path: 'player',
  //   children: [
  //     {
  //       path: '',
  //       loadChildren: '../player/player.module#PlayerModule'
  //     }
  //   ]
  // },
  {
    path: '',
    redirectTo: 'series',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
