// Source: My Timetable v2.pdf, 2026–2027 (New Timetable, updated 10 Nov), generated 17 November 2026. Effective Monday 23 November 2026.
window.LESSON_TIMETABLE = {"1":{"Computing":[{"day":"Monday","period":4,"time":"08:40–09:25"},{"day":"Tuesday","period":5,"time":"09:45–10:30"}]},"2":{"Computing":[{"day":"Monday","period":4,"time":"08:40–09:25"},{"day":"Tuesday","period":5,"time":"09:45–10:30"}]},"3":{"Computing":[{"day":"Wednesday","period":7,"time":"12:15–13:00"},{"day":"Thursday","period":4,"time":"08:40–09:25"}]},"4":{"Computing":[{"day":"Wednesday","period":7,"time":"12:15–13:00"},{"day":"Thursday","period":4,"time":"08:40–09:25"}]},"5":{"Computing":[{"day":"Monday","period":6,"time":"10:35–11:20"},{"day":"Wednesday","period":4,"time":"08:40–09:25"}]},"6":{"Computing":[{"day":"Monday","period":6,"time":"10:35–11:20"},{"day":"Wednesday","period":4,"time":"08:40–09:25"}]},"7":{"Computing":[{"day":"Monday","period":9,"time":"14:15–15:00"},{"day":"Friday","period":6,"time":"10:35–11:20"}]},"8":{"Computing":[{"day":"Monday","period":9,"time":"14:15–15:00"},{"day":"Friday","period":6,"time":"10:35–11:20"}]},"10-11":{"ICT":[{"day":"Tuesday","period":9,"time":"14:15–15:00"},{"day":"Thursday","period":5,"time":"09:45–10:30"}],"Computer Science":[{"day":"Monday","period":7,"time":"12:15–13:00"},{"day":"Tuesday","period":7,"time":"12:15–13:00"}],"Media Studies":[{"day":"Wednesday","period":9,"time":"14:15–15:00"},{"day":"Friday","period":7,"time":"12:15–13:00"}],"Design & Technology":[{"day":"Thursday","period":8,"time":"13:05–13:50"},{"day":"Friday","period":8,"time":"13:05–13:50"}]}};
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
