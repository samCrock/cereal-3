import {DateAgoPipe} from './pipes/date-ago.pipe';
import {NgModule} from '@angular/core';

const pipes = [
  DateAgoPipe
]

const commonComponents = [
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
