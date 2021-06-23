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

  currentRoute = ''

  constructor(
    private menu: MenuController,
    private location: Location,
    private router: Router
  ) {
    this.currentRoute = this.router.url.split('/').pop()
    router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((val) => {
        this.currentRoute = val instanceof RouterEvent ? val.url.split('/').pop() : ''
      })
  }

  ngOnInit() {
    setTimeout(() => {
      this.currentRoute = this.router.url.split('/').pop()
      console.log(this.currentRoute)
    })
  }

  async toggleMenu() {
    if (await this.menu.isOpen()) {
      this.menu.enable(false, 'first')
      this.menu.close('first')
    } else {
      this.menu.enable(true, 'first')
      this.menu.open('first')
    }
  }


}
