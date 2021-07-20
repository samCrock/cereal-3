import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {MenuController} from '@ionic/angular';
import {NavigationEnd, Router, RouterEvent} from '@angular/router';
import {Location} from '@angular/common';
import {filter} from 'rxjs/operators';

@Component({
  selector: 'app-series',
  templateUrl: 'series.page.html',
  styleUrls: ['series.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SeriesPage implements OnInit {

  constructor(
    private menu: MenuController,
    private location: Location,
    private router: Router
  ) {
  }

  ngOnInit() {

  }


}
