'use client'
import { useState, useEffect, useCallback } from "react";
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Package,
  UserRound,
  Mail,
  MapPin,
  Trash2,
} from 'lucide-react';
import StatusBadge, { labels } from "../../components/StatusBadge";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Order {
  id: string;
  productCode: string;
  name: string;
  orderStatus: string;
  price: number;
  quantity: number;
  userId: string;
}

interface User {
  name: string;
  paternalSurname: string;
  maternalSurname: string;
  email: string;
  shippingAddress: string;
}

const money = (value: number) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(value);


export default function Order() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { id } = params;
  const userId = searchParams.get('userId');

  const [order, setOrder] = useState<Order | null>(null);
  const [user, setUser] = useState<User>({
    name: "",
    paternalSurname: "",
    maternalSurname: "",
    email: "",
    shippingAddress: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      if (!userId) {
        throw new Error("No se proporcionó el usuario del pedido");
      }

      const [orderResponse, userResponse] = await Promise.all([
        fetch(`${API_URL}/orders/${id}`),
        fetch(`${API_URL}/user/${userId}`),
      ]);

      if (!orderResponse.ok || !userResponse.ok) {
        throw new Error("No fue posible cargar el detalle del pedido");
      }

      const [orderData, userData] = await Promise.all([
        orderResponse.json(),
        userResponse.json(),
      ]);

      setOrder(orderData);
      setUser(userData);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No fue posible cargar el detalle del pedido");
    } finally {
      setLoading(false);
    }
  }, [id, userId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const change = async (status: any) => {
    setSaving(true);
    try {
      const orderResponse = await fetch(
        `${API_URL}/orders/${id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...order, orderStatus: status })
        }
      );

      if (!orderResponse.ok) {
        throw new Error("No fue posible actualizar el pedido");
      }

      const updatedOrder: Order = await orderResponse.json();
      setOrder(updatedOrder);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!confirm("¿Eliminar este pedido? Esta acción no se puede deshacer."))
      return;

    await fetch(
      `${API_URL}/orders/${id}`,
      {
        method: 'DELETE'
      }
    );

    router.push("/");
  };

  if (loading) {
    return <div className="state">Cargando detalle del pedido…</div>;
  }

  if (error) {
    return (
      <div className="state">
        <span>{error}</span>
        <button type="button" onClick={loadData}>Reintentar</button>
        <Link href="/">Volver a pedidos</Link>
      </div>
    );
  }

  return (
    <>
      <Link href="/" className="back">
        <ArrowLeft size={18} />
        Volver a pedidos
      </Link>

      <section className="detail-head">
        <div>
          <p className="eyebrow">
            DETALLE DEL PEDIDO
          </p>

          <h1>{order?.productCode}</h1>

          <p>
            Folio #{order?.id.toUpperCase()}
          </p>
        </div>

        <StatusBadge status={order?.orderStatus} />
      </section>

      <div className="detail-grid">
        <section className="card">
          <h2>
            <Package />
            Información del pedido
          </h2>

          <dl>
            <div>
              <dt>Código de producto</dt>
              <dd>{order?.productCode}</dd>
            </div>

            <div>
              <dt>Precio unitario</dt>
              <dd>{money(order?.price || 0)}</dd>
            </div>

            <div>
              <dt>Cantidad</dt>
              <dd>{order?.quantity}</dd>
            </div>

            <div className="total">
              <dt>Total</dt>
              <dd>{money(order?.price && order.quantity ? order?.price * order?.quantity : 0)}</dd>
            </div>
          </dl>

          <label className="select-label">
            Actualizar estatus

            <select
              value={order?.orderStatus}
              disabled={saving}
              onChange={(e) => change(e.target.value)}
            >
              {Object.entries(labels).map(([value, label]) => (
                <option
                  value={value}
                  key={value}
                >
                  {label}
                </option>
              ))}
            </select>
          </label>
        </section>

        <section className="card">
          <h2>
            <UserRound />
            Cliente y entrega
          </h2>

          <div className="person">
            <strong>
              {[user.name, user.paternalSurname, user.maternalSurname]
                .filter(Boolean)
                .join(" ")}
            </strong>

            <span>
              <Mail />
              {user?.email}
            </span>

            <span>
              <MapPin />
              {user?.shippingAddress}
            </span>
          </div>
        </section>
      </div>

      <button
        className="danger"
        onClick={remove}
      >
        <Trash2 size={17} />
        Eliminar pedido
      </button>
    </>
  )
}
