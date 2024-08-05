import { Component, HostListener } from '@angular/core';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'IRMS';
  devMode = environment.devMode;

  onActivate(event: any) {
    window.scroll(0, 0);
  }

   /**
   * Description: This code is used for disabled right click option
   * Created on: 18th July 2024
   * Created by: Manish Kumar
   */
  @HostListener('document:contextmenu', ['$event'])
  onRightClick(event: MouseEvent) {
    if (!this.devMode) {
      event.preventDefault();
    }
  }

  /**
   * Description: This code is used for disabled keyboard option ctrl + shif + i and fn + f12 
   * Created on: 18th July 2024
   * Created by: Manish Kumar
   */
  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (!this.devMode) {
      if ((event.ctrlKey && event.shiftKey && event.key === 'I') || (event.key === 'F12') || (event.key === 'F12' && event.metaKey)) {
        event.preventDefault();
      }
    }
  }
}
