import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isValidDate'
})
export class IsValidDatePipe implements PipeTransform {

  transform(dataValue: any): boolean {
    if (dataValue instanceof Date && !isNaN(dataValue.getTime())) {
      return true;
    }
    if (typeof dataValue === 'string') {
      const date = new Date(dataValue);
      return !isNaN(date.getTime());
    }
    return false;
  }
   

}
