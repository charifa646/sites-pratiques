import type { Metadata } from "next";
import { PageHeader } from "@/components/sections/PageHeader";
import { BookingForm } from "@/components/sections/BookingForm";
import { headers, images } from "@/lib/data";

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
        image={images.scene.lightTrails}
        bgWord="RÉSERVER"
      />
      <BookingForm />
    </>
  );
}
