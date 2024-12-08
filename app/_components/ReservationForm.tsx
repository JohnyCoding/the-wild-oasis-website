"use client";
import Image from "next/image";
import { User } from "next-auth";
import { differenceInDays } from "date-fns";

import SubmitButton from "@/app/_components/SubmitButton";
import { CabinData } from "@/types/types";
import { useReservation } from "@/app/_components/ReservationContext";
import { createReservation } from "@/app/_lib/actions";

export default function ReservationForm({
    cabin,
    user,
}: {
    cabin: CabinData;
    user: User;
}) {
    const { range, resetRange } = useReservation();
    const { maxCapacity, regularPrice, discount, id: cabinId } = cabin;

    const startDate = range?.from;
    const endDate = range?.to;

    const numNights =
        range?.to && range?.from ? differenceInDays(range.to, range.from) : 0;
    const cabinPrice = (regularPrice - discount) * numNights;

    const reservationData = new FormData();
    reservationData.append("startDate", startDate?.toISOString() ?? "");
    reservationData.append("endDate", endDate?.toISOString() ?? "");
    reservationData.append("numNights", numNights.toString());
    reservationData.append("cabinPrice", cabinPrice.toString());
    reservationData.append("cabinId", cabinId.toString());
    const createReservationWithData = createReservation.bind(
        null,
        reservationData,
    );

    return (
        <div className="scale-[1.01]">
            <div className="flex items-center justify-between bg-primary-800 px-16 py-2 text-primary-300">
                <p>Logged in as</p>

                <div className="flex items-center gap-4">
                    <Image
                        referrerPolicy="no-referrer"
                        className="h-8 rounded-full"
                        src={user.image ?? ""}
                        alt={user.name ?? "image of user"}
                        width={32}
                        height={32}
                    />
                    <p>{user.name}</p>
                </div>
            </div>

            <form
                action={async (formData) => {
                    await createReservationWithData(formData);
                    resetRange();
                }}
                className="flex flex-col gap-5 bg-primary-900 px-16 py-10 text-lg"
            >
                <div className="space-y-2">
                    <label htmlFor="numGuests">How many guests?</label>
                    <select
                        name="numGuests"
                        id="numGuests"
                        className="w-full rounded-sm bg-primary-200 px-5 py-3 text-primary-800 shadow-sm"
                        required
                    >
                        <option value="" key="">
                            Select number of guests...
                        </option>
                        {Array.from(
                            { length: maxCapacity },
                            (_, i) => i + 1,
                        ).map((x) => (
                            <option value={x} key={x}>
                                {x} {x === 1 ? "guest" : "guests"}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label htmlFor="observations">
                        Anything we should know about your stay?
                    </label>
                    <textarea
                        name="observations"
                        id="observations"
                        className="w-full rounded-sm bg-primary-200 px-5 py-3 text-primary-800 shadow-sm"
                        placeholder="Any pets, allergies, special requirements, etc.?"
                    />
                </div>

                <div className="flex items-center justify-end gap-6">
                    {!(startDate && endDate) ? (
                        <p className="py-4 text-base text-primary-300">
                            Start by selecting dates
                        </p>
                    ) : (
                        <SubmitButton pendingLabel="Reserving...">
                            Reserve now
                        </SubmitButton>
                    )}
                </div>
            </form>
        </div>
    );
}
