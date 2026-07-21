const WEEKDAYS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

export default function WeekStrip({ rate }) {
  const todayIndex = (new Date().getDay() + 6) % 7;

  return (
    <div className="week-strip">
      {WEEKDAYS.map((day, index) => {
        let circleClass = 'future';
        if (index < todayIndex) {
          circleClass = rate > 75 ? 'completed' : 'missed';
        } else if (index === todayIndex) {
          circleClass = 'today';
        }
        return (
          <div className="day-slot" key={day}>
            <div className={`day-circle ${circleClass}`}>{circleClass === 'completed' ? '✔' : day.charAt(0)}</div>
            <span className="day-label">{day}</span>
          </div>
        );
      })}
    </div>
  );
}
