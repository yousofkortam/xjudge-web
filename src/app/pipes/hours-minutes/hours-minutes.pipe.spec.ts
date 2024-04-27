import { HoursMinutesPipe } from './hours-minutes.pipe';

describe('HoursMinutesPipe', () => {
  it('create an instance', () => {
    const pipe = new HoursMinutesPipe();
    expect(pipe).toBeTruthy();
  });
});
