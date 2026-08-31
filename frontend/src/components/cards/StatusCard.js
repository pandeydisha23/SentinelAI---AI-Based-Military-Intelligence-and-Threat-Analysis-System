import "./StatusCard.css";

function StatusCard({
  icon,
  title,
  value,
  subtitle,
  color,
}) {
  return (
    <div className="status-card">

      <div className="status-icon" style={{ color }}>
        {icon}
      </div>

      <div className="status-content">

        <p>{title}</p>

        <h2>{value}</h2>

        <span>{subtitle}</span>

      </div>

    </div>
  );
}

export default StatusCard;