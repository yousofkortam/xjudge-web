import { VerdictClassPipe } from './verdict-class.pipe';

describe('VerdictClassPipe', () => {
  const pipe = new VerdictClassPipe();

  it('maps the backend display strings', () => {
    expect(pipe.transform('Accepted')).toBe('accepted');
    expect(pipe.transform('Wrong answer')).toBe('wrong');
    expect(pipe.transform('Time limit exceeded')).toBe('tle');
    expect(pipe.transform('Memory limit exceeded')).toBe('mle');
    expect(pipe.transform('Runtime error')).toBe('runtime');
    expect(pipe.transform('Compilation error')).toBe('compile');
    expect(pipe.transform('In queue')).toBe('pending');
    expect(pipe.transform('Running')).toBe('running');
  });

  it('maps raw enum names', () => {
    expect(pipe.transform('WRONG_ANSWER')).toBe('wrong');
    expect(pipe.transform('TIME_LIMIT_EXCEEDED')).toBe('tle');
  });

  it('maps short judge codes', () => {
    expect(pipe.transform('AC')).toBe('accepted');
    expect(pipe.transform('TLE')).toBe('tle');
    expect(pipe.transform('CE')).toBe('compile');
  });

  it('treats a missing verdict as pending rather than failing', () => {
    expect(pipe.transform(null)).toBe('pending');
    expect(pipe.transform('')).toBe('pending');
  });

  it('falls back to unknown for anything unrecognised', () => {
    expect(pipe.transform('Something else')).toBe('unknown');
  });
});
