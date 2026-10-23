// School clock in Asia/Bangkok. Times follow My Timetable Final.pdf (31 August 2026).
(function () {
  const zone = 'Asia/Bangkok';
  const formatter12 = new Intl.DateTimeFormat('en-US', {timeZone:zone,hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:true});
  const formatter24 = new Intl.DateTimeFormat('en-GB', {timeZone:zone,hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'});
  const weekday = new Intl.DateTimeFormat('en-GB', {timeZone:zone,weekday:'long'});
  const slots = [
    ['08:00','08:15','Period 1 · Student Arrival'],
    ['08:15','08:30','Period 2 · Flag Lineup'],
    ['08:30','08:40','Period 3 · Homeroom'],
    ['08:40','09:25','Period 4'],
    ['09:25','09:45','First Snack'],
    ['09:45','10:30','Period 5'],
    ['10:35','11:20','Period 6'],
    ['11:20','12:15','Lunch Break'],
    ['12:15','13:00','Period 7'],
    ['13:05','13:50','Period 8'],
    ['13:50','14:10','Second Snack'],
    ['14:15','15:00','Period 9'],
    ['15:00','16:00','Period 10 · ECA']
  ];
  function status(now = new Date()) {
    const date = SCHOOL_CALENDAR.bangkokDate(now), state = SCHOOL_CALENDAR.current(date);
    if (state.term === undefined || state.kind === 'break') return {label:state.label};
    if (['Saturday','Sunday'].includes(weekday.format(now))) return {label:'Weekend'};
    const time = formatter24.format(now).slice(0,5);
    const slot = slots.find(s => time >= s[0] && time < s[1]);
    if (slot) return {label:slot[2],range:slot[0]+'–'+slot[1]};
    return {label:time<'08:00'?'Before School':time>='16:00'?'After School':'Between Periods'};
  }
  function tick(now = new Date()) {
    const el = document.querySelector('.school-clock'); if (!el) return;
    const times = [formatter12.format(now),formatter24.format(now)];
    el.querySelectorAll('time').forEach((time,i)=>{
      const value=times[i].replace(/\s+/g,' ');
      const parts=value.match(/\d|:|[AP]M/g);
      if (!time.children.length) {
        parts.forEach(part=>{
          const span=document.createElement('span');
          span.className=/\d/.test(part)?'clock-digit':part===':'?'clock-separator':'clock-meridiem';
          span.setAttribute('aria-hidden','true');span.textContent=part;time.appendChild(span);
        });
      } else {
        parts.forEach((part,index)=>{if(time.children[index].textContent!==part)time.children[index].textContent=part});
      }
      time.setAttribute('aria-label',value);time.dateTime=now.toISOString();
    });
    const current = status(now), label = el.querySelector('.clock-period');
    const text = current.label+(current.range?' · '+current.range:'');
    if (label.textContent !== text) label.textContent=text;
  }
  function mount() {
    const container=document.querySelector('#school-status');
    if (!container || container.querySelector('.school-clock')) return;
    const el=document.createElement('div');el.className='school-clock';el.setAttribute('aria-label','Current Thailand time and school period');
    el.innerHTML='<div class="clock-times"><div class="clock-time"><time></time><span class="clock-format">12-hour</span></div><div class="clock-time"><time></time><span class="clock-format">24-hour</span></div></div><span class="clock-period" aria-live="polite"></span>';
    container.appendChild(el);tick();
  }
  window.SCHOOL_CLOCK={mount,tick,status};
  setInterval(()=>tick(),1000);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)tick()});
})();
