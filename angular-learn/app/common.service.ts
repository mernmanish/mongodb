import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  trueLoader: number = 0;
  falseLoader: number = 0;

  constructor() { }
  /**
   * Function Name: loader
   * Description: This function is used to control the loader spin.
   * Created By: Bibhuti Bhusan Sahoo
   * Created On: 16th Jan 2024
   */
  loader(eVal:any){
    if(eVal == true)
      this.trueLoader++;
    else
      this.falseLoader++;
    if(this.trueLoader === this.falseLoader){
      // this.loading = false;
      this.trueLoader = 0;
      this.falseLoader = 0;
      return false;
    }
    else
      // this.loading = true;
      return true;
  }
}
