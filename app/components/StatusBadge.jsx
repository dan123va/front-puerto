const labels = {
  CREADO: "Creado",
  CONFIRMADO: "Confirmado",
  EN_PREPARACION: "En preparación",
  ENVIADO: "Enviado",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelado",
};
export default function StatusBadge({ status }) {
  return (
    <span className={`badge status-${status?.toLowerCase()}`}>
      {labels[status] || status}
    </span>
  );
}
export { labels };
