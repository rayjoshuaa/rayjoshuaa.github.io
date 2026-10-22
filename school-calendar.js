// Timetable slots are keyed by year and subject, then weekly lesson order.
// Populate only from the school's confirmed timetable, e.g.
// window.LESSON_TIMETABLE = {'1': {Computing: [{period: 2, time: '09:00–09:50'}, ...]}};
window.LESSON_TIMETABLE = {};
(function () {
  const DAY = 86400000;
  const starts = ['2026-08-24', '2027-01-04', '2027-04-19'];
  function bangkokDate(now = new Date()) {
    return new Intl.DateTimeFormat('en-CA', {timeZone:'Asia/Bangkok',year:'numeric',month:'2-digit',day:'2-digit'}).format(now);
  }
  function current(date = bangkokDate()) {
    const stamp = Date.parse(date + 'T00:00:00Z');
    const terms = window.CURRICULUM['1'].Computing.terms;
    for (let term = 0; term < starts.length; term++) {
      const week = Math.floor((stamp - Date.parse(starts[term] + 'T00:00:00Z')) / (7 * DAY));
      if (week >= 0 && week < terms[term].weeks.length) {
        const kind = terms[term].weeks[week][3];
        return {term, week, kind, label: kind === 'break' ? 'Midterm break' : kind === 'assessment' ? 'Assessment week' : ''};
      }
    }
    if (date < starts[0]) return {label:'Before the academic year'};
    if (date > '2027-07-04') return {label:'Academic year completed'};
    return {label:'School holiday'};
  }
  window.SCHOOL_CALENDAR = {bangkokDate, current};
})();
