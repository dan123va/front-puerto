'use client'
import { useState, useEffect } from "react";
import { useParams, useSearchParams } from 'next/navigation';

export default function Order() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const { id } = params;
  const userId = searchParams.get('userId');
  const [users, setOrder] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getOrder = async () => {
    setLoading(true);
    setError("");
    try {
      const orderResponse = await fetch(`https://api-java-puerto.onrender.com/api/orders/id`);
      const data = await orderResponse.json()
      
      setOrder(data)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No fue posible cargar las ordenes");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getOrder();
  }, []);

  return (
    <>
      <h1>Hola {id} {userId}</h1>
    </>
  )
}
