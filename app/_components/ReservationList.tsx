"use client";
import { useOptimistic } from "react";

import ReservationCard from "@/app/_components/ReservationCard";
import { GuestBookingData } from "@/types/types";
import { deleteReservation } from "@/app/_lib/actions";

export default function ReservationList({
    bookings,
}: {
    bookings: GuestBookingData[];
}) {
    const [optimisticBookings, optimisticDelete] = useOptimistic(
        bookings,
        (currBookings, bookingId) => {
            return currBookings.filter((booking) => booking.id !== bookingId);
        },
    );

    async function handleDelete(id: number) {
        optimisticDelete(id);
        await deleteReservation(id);
    }

    return (
        <ul className="space-y-6">
            {optimisticBookings.map((booking) => (
                <ReservationCard
                    booking={booking}
                    onDelete={handleDelete}
                    key={booking.id}
                />
            ))}
        </ul>
    );
}
