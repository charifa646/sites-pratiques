import type { Metadata } from "next";
import { PageHeader } from "@/components/sections/PageHeader";
import { BookingForm } from "@/components/sections/BookingForm";
import { headers } from "@/lib/data";

export const metadata: Metadata = {
  title: "Réservation",
  description: headers.reservation.subtitle,
};

export default function ReservationPage() {
  return (
    <>
      <PageHeader
        title={headers.reservation.title}
        subtitle={headers.reservation.subtitle}
      />
      <BookingForm />
    </>
  );
}
