import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hoursMinutes'
})
export class HoursMinutesPipe implements PipeTransform {

  transform(value: number): string {
    const days: number = Math.floor(value / 24);
    const remainingHours: number = Math.floor(value % 24);
    const minutes: number = Math.round((value - Math.floor(value)) * 60);
    let result = '';

    if (days > 0) {
      result += `${days} day${days > 1 ? 's' : ''} `;
    } else {
      result += `${remainingHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }

    return result;
  }

}
