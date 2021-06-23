import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {PlayerComponent} from './player.component';
import {IonicModule} from '@ionic/angular';


@NgModule({
  declarations: [
    PlayerComponent
  ],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                component: PlayerComponent,
            },
        ]),
        IonicModule
    ]
})
export class PlayerModule {
}
