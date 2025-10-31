export default function InsightCard({ icon, title, value, subtitle }) {
  return (
    <div
      className={`insight-card ${
        title === "Caixa Acumulado"
          ? "sales"
          : title === "Custos e Despesas"
          ? "expenses"
          : "income"
      }`}
    >
      <span className="material-icons-sharp">{icon}</span>
      <div className="middle">
        <div className="left">
          <h3>{title}</h3>
          <h1>{value}</h1>
        </div>
      </div>
      <small className="text-muted">{subtitle}</small>
    </div>
  );
}
