// Source: My Timetable Final.pdf, 2026–2027, generated 31 August 2026.
window.LESSON_TIMETABLE = {"1":{"Computing":[{"day":"Monday","period":8,"time":"13:05–13:50"},{"day":"Thursday","period":9,"time":"14:15–15:00"}]},"2":{"Computing":[{"day":"Monday","period":8,"time":"13:05–13:50"},{"day":"Thursday","period":9,"time":"14:15–15:00"}]},"3":{"Computing":[{"day":"Monday","period":5,"time":"09:45–10:30"},{"day":"Thursday","period":6,"time":"10:35–11:20"}]},"4":{"Computing":[{"day":"Monday","period":5,"time":"09:45–10:30"},{"day":"Thursday","period":6,"time":"10:35–11:20"}]},"5":{"Computing":[{"day":"Wednesday","period":4,"time":"08:40–09:25"},{"day":"Thursday","period":5,"time":"09:45–10:30"}]},"6":{"Computing":[{"day":"Wednesday","period":4,"time":"08:40–09:25"},{"day":"Thursday","period":5,"time":"09:45–10:30"}]},"7":{"Computing":[{"day":"Monday","period":9,"time":"14:15–15:00"},{"day":"Tuesday","period":5,"time":"09:45–10:30"}]},"8":{"Computing":[{"day":"Monday","period":9,"time":"14:15–15:00"},{"day":"Tuesday","period":5,"time":"09:45–10:30"}]},"10-11":{"ICT":[{"day":"Monday","period":7,"time":"12:15–13:00"},{"day":"Wednesday","period":7,"time":"12:15–13:00"}],"Computer Science":[{"day":"Monday","period":6,"time":"10:35–11:20"},{"day":"Friday","period":6,"time":"10:35–11:20"}],"Media Studies":[{"day":"Tuesday","period":9,"time":"14:15–15:00"},{"day":"Friday","period":7,"time":"12:15–13:00"}],"Design & Technology":[{"day":"Tuesday","period":7,"time":"12:15–13:00"},{"day":"Wednesday","period":9,"time":"14:15–15:00"}]}};
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
