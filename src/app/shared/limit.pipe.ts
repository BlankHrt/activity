import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'limit',
    pure: false
})
export class LimitSortPipe implements PipeTransform {
    transform(array: any[], field: string): any[] {
        return array.slice(0, 2);
    }
}
