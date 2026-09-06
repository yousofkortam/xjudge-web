import { Pipe, PipeTransform } from '@angular/core';

/**
 * Maps a judge verdict to the `.xj-verdict--*` modifier that styles it.
 *
 * The vocabulary mirrors the backend's JudgeVerdict.display() strings
 * ("Accepted", "Wrong answer", "Time limit exceeded", …) but also tolerates the
 * raw enum names and the short codes remote judges return, because submissions
 * created before a verdict is normalised can carry either.
 */
@Pipe({
  name: 'verdictClass',
  pure: true,
})
export class VerdictClassPipe implements PipeTransform {

  transform(verdict: string | null | undefined): string {
    if (!verdict) return 'pending';
    const text = verdict.trim().toUpperCase().replace(/_/g, ' ');

    if (text === 'AC' || text === 'OK' || text.startsWith('ACCEPTED')) return 'accepted';
    if (text === 'WA' || text.startsWith('WRONG ANSWER')) return 'wrong';
    if (text === 'TLE' || text.startsWith('TIME LIMIT')) return 'tle';
    if (text === 'MLE' || text.startsWith('MEMORY LIMIT')) return 'mle';
    if (text === 'RE' || text === 'NZEC' || text.startsWith('RUNTIME ERROR')) return 'runtime';
    if (text === 'CE' || text.startsWith('COMPIL')) return 'compile';
    if (text === 'PE' || text.startsWith('PRESENTATION') ||
        text === 'OLE' || text.startsWith('OUTPUT LIMIT')) return 'wrong';
    if (text === 'WJ' || text === 'WQ' || text === 'PENDING' ||
        text.includes('QUEUE') || text.startsWith('WAITING')) return 'pending';
    if (text === 'WR' || text.startsWith('RUNNING') || text.startsWith('JUDGING') ||
        text.startsWith('TESTING') || /^\d+\s*\/\s*\d+/.test(text)) return 'running';

    return 'unknown';
  }
}
