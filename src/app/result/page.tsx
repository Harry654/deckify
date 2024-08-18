"use client";

import { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function ResultPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const session_id = searchParams.get("session_id");
  const [loading, setLoading] = useState<boolean>(true);
  const [session, setSession] = useState<{
    payment_status: string;
    [key: string]: any;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCheckoutSession = async () => {
      if (!session_id) return;
      try {
        const res = await fetch(
          `/api/checkout_sessions?session_id=${session_id}`,
        );
        const sessionData = await res.json();
        if (res.ok) {
          setSession(sessionData);
        } else {
          setError(sessionData.error);
        }
      } catch (err) {
        setError("An error occurred while retrieving the session.");
      } finally {
        setLoading(false);
      }
    };
    fetchCheckoutSession();
  }, [session_id]);

  if (loading) {
    return (
      <div className="mt-1 max-w-sm text-center">
        <CircularProgress />
        <p className="mt-1">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-1 max-w-sm text-center">
        <p className="text-red-900">{error}</p>
      </div>
    );
  }

  return (
    <section id="result" className="pt-16 md:pt-20 lg:pt-28">
      <div className="container h-96">
        {session?.payment_status === "paid" ? (
          <div className="mt-auto flex flex-col items-center justify-center gap-5">
            <h1 className="text-3xl font-bold">
              Thank you for your subscription!
            </h1>
            <div className="mt-2">
              <p>
                We have received your payment. You will receive an email with
                the order details shortly.
              </p>
            </div>
            <Link href="/" className="bg-blue-600 p-2 rounded-md">
              Back to Home
            </Link>
          </div>
        ) : (
          <>
            <p>Payment failed</p>
            <div className="mt-2">
              <p>Your payment was not successful. Please try again.</p>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
