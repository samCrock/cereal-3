import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

const routes: Routes = [
  { path: '', redirectTo: 'series', pathMatch: 'full' },
  { path: 'series', loadChildren: './modules/series/series.module#SeriesModule' },
  { path: 'movies', loadChildren: './modules/movies/movies.module#MoviesModule' }
]
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
