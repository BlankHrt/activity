import { Pipe, PipeTransform, NgZone, ChangeDetectorRef, OnDestroy } from '@angular/core';
@Pipe({
    name: 'timeAgo',
    pure: false
})
export class TimeAgoPipe implements PipeTransform, OnDestroy {
    private timer: any;
    constructor(private changeDetectorRef: ChangeDetectorRef, private ngZone: NgZone) { }
    transform(value: number) {
        this.removeTimer();
        const now = new Date();
        const seconds = (now.getTime() - value) / 1000;
        const timeToUpdate = this.getSecondsUntilUpdate(seconds) * 1000;
        const minutes = Math.round(seconds / 60);
        const hours = Math.round(minutes / 60);
        const days = Math.round(hours / 24);
        const months = Math.round(days / 30.416);
        const years = Math.round(days / 365);
        this.timer = this.ngZone.runOutsideAngular(() => {
            if (typeof window !== 'undefined') {
                return window.setTimeout(() => {
                    this.ngZone.run(() => this.changeDetectorRef.markForCheck());
                }, timeToUpdate);
            }
            return null;
        });

        if (seconds <= 60) {
            return '刚刚';
        } else if (seconds <= 90) {
            return '1 分钟前';
        } else if (minutes <= 45) {
            return minutes + ' 分钟前';
        } else if (minutes <= 90) {
            return '1 小时前';
        } else if (hours <= 22) {
            return hours + ' 小时前';
        } else if (hours <= 36) {
            return '1 天前';
        } else if (days <= 25) {
            return days + ' 天前';
        } else if (days <= 45) {
            return '1 个月前';
        } else if (days <= 345) {
            return months + ' 个月前';
        } else if (days <= 545) {
            return '1 年前';
        } else { // (days > 545)
            return years + ' 年前';
        }
    }
    ngOnDestroy(): void {
        this.removeTimer();
    }
    private removeTimer() {
        if (this.timer) {
            window.clearTimeout(this.timer);
            this.timer = null;
        }
    }
    private getSecondsUntilUpdate(seconds: number) {
        const min = 60;
        const hr = min * 60;
        const day = hr * 24;
        if (seconds < min) { // less than 1 min, update ever 2 secs
            return 2;
        } else if (seconds < hr) { // less than an hour, update every 30 secs
            return 30;
        } else if (seconds < day) { // less then a day, update every 5 mins
            return 300;
        } else { // update every hour
            return 3600;
        }
    }
}
