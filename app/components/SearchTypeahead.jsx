"use client";

import { Search, X } from "lucide-react";
import { useMemo, useState } from "react";

export default function SearchTypeahead({ orders, onSelect }) {
  const [term, setTerm] = useState("");
  const [open, setOpen] = useState(false);

  const options = useMemo(() => {
    const q = term.trim().toLowerCase();
    if (!q) return [];

    return orders
      .filter((order) =>
        [order?.id, order?.productCode, order?.name].some((value) =>
          String(value ?? "").toLowerCase().includes(q),
        ),
      )
      .slice(0, 6);
  }, [term, orders]);

  const choose = (item) => {
    setTerm(item ? `${item.productCode} · ${item.name}` : "");
    setOpen(false);
    onSelect(item);
  };

  return (
    <div className="typeahead">
      <Search size={19} />
      <input
        aria-label="Buscar pedidos"
        placeholder="Busca por cliente, producto o folio"
        value={term}
        onFocus={() => setOpen(true)}
        onChange={(event) => {
          setTerm(event.target.value);
          setOpen(true);
          onSelect(null);
        }}
      />
      {term && (
        <button
          type="button"
          className="clear"
          onClick={() => choose(null)}
          aria-label="Limpiar"
        >
          <X size={17} />
        </button>
      )}
      {open && term && (
        <div className="suggestions">
          {options.length ? (
            options.map((item) => (
              <button type="button" key={item.id} onClick={() => choose(item)}>
                <strong>{item.productCode}</strong>
                <span>{item.name}</span>
                <small>#{item.id}</small>
              </button>
            ))
          ) : (
            <div className="no-results">
              No hay resultados que coincidan con tu búsqueda
            </div>
          )}
        </div>
      )}
    </div>
  );
}
