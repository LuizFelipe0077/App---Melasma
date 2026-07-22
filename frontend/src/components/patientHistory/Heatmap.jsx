export default function Heatmap({ days }) {
  return (
    <div className="heatmap-strip-large">
      {days.map((day) => (
        <div
          key={day.date.toDateString()}
          className={`heatmap-square ${day.status}`}
          title={`Dia ${day.dayNumber} — ${day.date.toLocaleDateString('pt-BR')}`}
        />
      ))}
    </div>
  );
}
