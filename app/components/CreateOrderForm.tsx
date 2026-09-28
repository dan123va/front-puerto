"use client";

import { FormEvent, useState } from "react";
import { Plus, X } from "lucide-react";

interface Order {
  id: string;
  userId: string;
  name: string;
  productCode: string;
  quantity: number;
  price: number;
  orderStatus: string;
}

interface CreatedUser {
  id: string;
}

interface CreateOrderFormProps {
  apiUrl?: string;
  onCreated: (order: Order) => void;
}

const initialForm = {
  name: "",
  paternalSurname: "",
  maternalSurname: "",
  email: "",
  shippingAddress: "",
  productCode: "",
  quantity: "1",
  price: "",
};

export default function CreateOrderForm({ apiUrl, onCreated }: CreateOrderFormProps) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const close = () => {
    if (!saving) {
      setOpen(false);
      setError("");
    }
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      if (!apiUrl) {
        throw new Error("Falta configurar NEXT_PUBLIC_API_URL");
      }

      const userResponse = await fetch(`${apiUrl}/user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          paternalSurname: form.paternalSurname.trim(),
          maternalSurname: form.maternalSurname.trim(),
          email: form.email.trim(),
          shippingAddress: form.shippingAddress.trim(),
        }),
      });

      if (!userResponse.ok) {
        throw new Error("No fue posible crear el usuario");
      }

      const user: CreatedUser = await userResponse.json();
      const customerName = [form.name, form.paternalSurname, form.maternalSurname]
        .map((value) => value.trim())
        .filter(Boolean)
        .join(" ");

      const orderResponse = await fetch(`${apiUrl}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          name: customerName,
          productCode: form.productCode.trim(),
          quantity: Number(form.quantity),
          price: Number(form.price),
          orderStatus: "CREADO",
        }),
      });

      if (!orderResponse.ok) {
        throw new Error("El usuario se creó, pero no fue posible crear la orden");
      }

      const order: Order = await orderResponse.json();
      onCreated(order);
      setForm(initialForm);
      setOpen(false);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No fue posible crear la orden");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <button type="button" className="create-trigger" onClick={() => setOpen(true)}>
        <Plus size={17} />
        Nueva orden
      </button>

      {open && (
        <div className="modal-backdrop" role="presentation" onMouseDown={close}>
          <section
            className="create-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-order-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="modal-head">
              <div>
                <p className="eyebrow">NUEVO REGISTRO</p>
                <h2 id="create-order-title">Crear orden</h2>
                <p>Se registrará el cliente y su pedido en un solo paso.</p>
              </div>
              <button type="button" className="icon-button" onClick={close} aria-label="Cerrar">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={submit}>
              <fieldset disabled={saving}>
                <legend>Datos del cliente</legend>
                <div className="form-grid">
                  <label>
                    Nombre
                    <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  </label>
                  <label>
                    Apellido paterno
                    <input required value={form.paternalSurname} onChange={(e) => setForm({ ...form, paternalSurname: e.target.value })} />
                  </label>
                  <label>
                    Apellido materno
                    <input value={form.maternalSurname} onChange={(e) => setForm({ ...form, maternalSurname: e.target.value })} />
                  </label>
                  <label>
                    Correo electrónico
                    <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  </label>
                  <label className="full-field">
                    Dirección de entrega
                    <input required value={form.shippingAddress} onChange={(e) => setForm({ ...form, shippingAddress: e.target.value })} />
                  </label>
                </div>
              </fieldset>

              <fieldset disabled={saving}>
                <legend>Datos del pedido</legend>
                <div className="form-grid order-fields">
                  <label>
                    Código de producto
                    <input required value={form.productCode} onChange={(e) => setForm({ ...form, productCode: e.target.value })} />
                  </label>
                  <label>
                    Cantidad
                    <input type="number" min="1" step="1" required value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
                  </label>
                  <label>
                    Precio unitario
                    <input type="number" min="0.01" step="0.01" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                  </label>
                </div>
              </fieldset>

              {error && <p className="inline-error" role="alert">{error}</p>}

              <div className="form-actions">
                <button type="button" className="secondary-button" onClick={close}>Cancelar</button>
                <button type="submit" className="primary-button" disabled={saving}>
                  {saving ? "Creando…" : "Crear orden"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </>
  );
}
