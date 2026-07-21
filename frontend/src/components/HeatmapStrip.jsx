const WEEKDAYS = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'];

export default function HeatmapStrip({ rate }) {
  const todayIndex = (new Date().getDay() + 6) % 7;

  return (
    <div className="heatmap-strip">
      {WEEKDAYS.map((label, index) => {
        let cls = 'future';
        if (index < todayIndex) cls = rate > 75 ? 'completed' : 'missed';
        else if (index === todayIndex) cls = 'today';

        return (
          <div className="heatmap-day" key={index}>
            <div className={`heatmap-cell ${cls}`}>{cls === 'completed' ? '✓' : label}</div>
          </div>
        );
      })}
    </div>
  );
}
