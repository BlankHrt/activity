import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filterLength'
})
export class FilterLengthPipe implements PipeTransform {
    transform(array: any[], field: string, value: string): any {
        array = array.filter(x => x[field] !== value);
        return array.length;
    }
}

@Pipe({
    name: 'filterHanzi'
})
export class FilterHanziPipe implements PipeTransform {
    transform(hanzi: string, value: number): any {
        if (hanzi.length > 10) {
            hanzi = hanzi.slice(0, value) + '...';
        }
        return hanzi;
    }
}
