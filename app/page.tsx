"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, PackageOpen, RefreshCw } from "lucide-react";
import StatusBadge from "./components/StatusBadge";
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

const money = (value: number) =>
    new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(value);

export default function Home() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const getOrders = async () => {
        setLoading(true);
        setError("");
        try {
            const ordersResponse = await fetch(`${API_URL}/orders`);
            if (!ordersResponse.ok) {
                throw new Error("No fue posible cargar los pedidos");
            }

            const data = await ordersResponse.json();
            setOrders(data);
        } catch (cause) {
            setError(cause instanceof Error ? cause.message : "No fue posible cargar los pedidos");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getOrders();
    }, []);

    return <>
        <section className="hero">
            <div>
                <p className="eyebrow">CENTRO DE PEDIDOS</p>
                <h1>Todos tus pedidos,<br /><em>bajo control.</em></h1>
                <p>Consulta y da seguimiento a las compras realizadas desde la app y el sitio web.</p>
            </div>
            <div className="metric"><PackageOpen /><span>{orders.length}</span><small>pedidos registrados</small></div>
        </section>
        <section className="panel">
            {loading ? <div className="state"><RefreshCw className="spin" /> Cargando pedidos…</div> :
                error ? <div className="state">
                    <span>{error}</span>
                    <button type="button" onClick={getOrders}>Reintentar</button>
                </div> :
                <div className="table-wrap"><table>
                    <thead>
                        <tr>
                            <th>Pedido</th>
                            <th>Cliente</th>
                            <th>Estado</th>
                            <th>Total</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>{orders.length > 0 && orders.map((order) => <tr key={order?.id}>
                        <td data-label="Pedido">
                            <strong>{order?.productCode}</strong>
                            <small>#{order?.id.slice(-8).toUpperCase()}</small>
                        </td>
                        <td data-label="Cliente">
                            <strong>{order?.name}</strong>
                            {/* <small>{order?.email}</small> */}
                        </td>
                        <td data-label="Estado">
                            <StatusBadge status={order?.orderStatus} />
                        </td>
                        <td data-label="Total">
                            <strong>{money(order?.price * order?.quantity)}</strong>
                            <small>{order?.quantity} {order?.quantity === 1 ? "artículo" : "artículos"}</small>
                        </td>
                        <td>
                            <Link className="detail-link" href={`/orders/${order?.id}?userId=${order.userId}`}>Ver detalle <ArrowRight size={17} />
                            </Link>
                        </td>
                    </tr>)}</tbody>
                </table></div>}
        </section>
    </>;
}
