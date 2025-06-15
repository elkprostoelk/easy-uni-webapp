import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'gender'
})
export class GenderPipe implements PipeTransform {
  readonly genders = [{id:0, name:'Male'}, {id: 1,name:'Female'}];

  transform(value: number): string {
    return this.genders.find(g => g.id == value)?.name ?? '';
  }

}
