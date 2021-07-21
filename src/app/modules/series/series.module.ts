import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {PreviewCardComponent} from '../shared/components/preview-card/preview-card.component';
import {SeriesDetailComponent} from './series-detail/series-detail.component';
import {EpisodeCardComponent} from './episode-card/episode-card.component';
import {SharedModule} from '../shared/shared.module';
import {DiscoverComponent} from './discover/discover.component';
import {MyListComponent} from './my-list/my-list.component';
import {CalendarComponent} from './calendar/calendar.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        redirectTo: 'discover',
        pathMatch: 'full'
      },
      {
        path: 'discover',
        component: DiscoverComponent
      },
      {
        path: 'my-list',
        component: MyListComponent
      },
      {
        path: 'calendar',
        component: CalendarComponent
      },
      {
        path: ':id',
        component: SeriesDetailComponent,
      },
    ])
  ],
  declarations: [
    SeriesDetailComponent,
    PreviewCardComponent,
    EpisodeCardComponent,
    DiscoverComponent,
    MyListComponent,
    CalendarComponent
  ]
})
export class SeriesModule {
}
