import {DateAgoPipe} from './pipes/date-ago.pipe';
import {NgModule} from '@angular/core';
import {TrailerBtnComponent} from './components/trailer-btn/trailer-btn.component';

const pipes = [
  DateAgoPipe
]

const commonComponents = [
  TrailerBtnComponent
]

const directives = [
]

@NgModule({
    declarations: [
        [...commonComponents],
        [...pipes],
        [...directives],
    ],
  entryComponents: [
  ],
  imports: [
  ],
    exports: [
        [...commonComponents],
        [...pipes],
        [...directives],
    ],
  providers: [
    [...pipes]
  ]
})

export class SharedModule {
}
