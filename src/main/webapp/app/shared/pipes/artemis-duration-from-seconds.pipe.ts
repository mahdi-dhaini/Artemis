import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'artemisDurationFromSeconds' })
export class ArtemisDurationFromSecondsPipe implements PipeTransform {
    private readonly secondsInDay = 60 * 60 * 24;
    private readonly secondsInHour = 60 * 60;
    private readonly secondsInMinute = 60;

    /**
     * Convert seconds to a human-readable duration format:
     * If short is true: "xx unit yy unit", where only the two highest units are shown. If the time is between 10 minutes and one hour, only the minutes are shown
     * Otherwise: "1d 11h 7min 6s", where the days and hours are left out if their value and all higher values are zero
     * @param short? {boolean} allows the format to be shortened
     * @param seconds {number}
     */
    transform(seconds: number, short = false): string {
        if (seconds === null || seconds <= 0) {
            return '0min 0s';
        }

        const days = Math.floor(seconds / this.secondsInDay);
        const hours = Math.floor((seconds % this.secondsInDay) / this.secondsInHour);
        const minutes = Math.floor((seconds % this.secondsInHour) / this.secondsInMinute);
        seconds = seconds % this.secondsInMinute;

        if (short === true) {
            return this.handleShortFormat(days, hours, minutes, seconds);
        } else {
            return this.handleLongFormat(days, hours, minutes, seconds);
        }
    }

    private handleShortFormat(days: number, hours: number, minutes: number, seconds: number): string {
        if (days > 0) {
            return days + 'd ' + hours + 'h';
        } else if (hours > 0) {
            return hours + 'h ' + minutes + 'min';
        } else if (minutes >= 10) {
            return minutes + 'min';
        } else {
            return minutes + 'min ' + seconds + 's';
        }
    }

    private handleLongFormat(days: number, hours: number, minutes: number, seconds: number): string {
        if (days > 0) {
            return days + 'd ' + hours + 'h ' + minutes + 'min ' + seconds + 's';
        }
        if (hours > 0) {
            return hours + 'h ' + minutes + 'min ' + seconds + 's';
        }
        return minutes + 'min ' + seconds + 's';
    }
}
