import { Component } from '@angular/core';
import { detectBody } from '../../../app.helpers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

declare var jQuery: any;

@Component({
  selector: 'basic',
  templateUrl: 'basicLayout.template.html',
  host: {
    '(window:resize)': 'onResize()'
  }
})
export class BasicLayoutComponent {
  // Decorator wires up blockUI instance
  @BlockUI() blockUI: NgBlockUI;

  constructor() {
    // this.blockUI.start('Loading...'); // Start blocking

    // setTimeout(() => {
    //   this.blockUI.stop(); // Stop blocking
    // }, 2000);
  }

  public ngOnInit(): any {
    detectBody();
  }

  public onResize() {
    detectBody();
  }

}
