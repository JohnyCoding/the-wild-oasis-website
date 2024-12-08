"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isPast, isWithinInterval } from "date-fns";

import { auth, signIn, signOut } from "@/app/_lib/auth";
import { supabase } from "@/app/_lib/supabase";
import { getBookedDatesByCabinId, getBookings } from "@/app/_lib/data-service";

export async function signInAction() {
    await signIn("google", { redirectTo: "/account" });
}

export async function signOutAction() {
    await signOut({ redirectTo: "/" });
}

export async function updateGuest(formData: FormData) {
    const session = await auth();
    if (!session) throw new Error("You must be logged in");

    const nationalID = formData.get("nationalID") as string;
    const [nationality, countryFlag] = (
        formData.get("nationality") as string
    ).split("%");

    if (!/^[a-zA-Z0-9]{6,12}$/.test(nationalID))
        throw new Error("Please provide a valid national ID");

    const updateData = { nationality, countryFlag, nationalID };

    const { error } = await supabase
        .from("guests")
        .update(updateData)
        .eq("id", session.user.guestId);

    if (error) throw new Error("Guest could not be updated");

    revalidatePath("/account/profile");
}

export async function deleteReservation(id: number) {
    const session = await auth();
    if (!session) throw new Error("You must be logged in");

    // authorization
    const guestBookings = await getBookings(session.user.guestId);
    const guestBookingsIds = guestBookings.map((booking) => booking.id);
    if (!guestBookingsIds.includes(id))
        throw new Error("You are not allowed to delete this booking");

    const { error } = await supabase.from("bookings").delete().eq("id", id);

    if (error) throw new Error("Booking could not be deleted");

    revalidatePath("/account/reservations");
}

export async function updateReservation(formData: FormData) {
    const session = await auth();
    if (!session) throw new Error("You must be logged in");

    const reservationId = Number(formData.get("reservationId"));

    // authorization
    const guestBookings = await getBookings(session.user.guestId);
    const guestBookingsIds = guestBookings.map((booking) => booking.id);
    if (!guestBookingsIds.includes(reservationId))
        throw new Error("You are not allowed to update this booking");

    const updateData = {
        numGuests: Number(formData.get("numGuests")),
        observations: (formData.get("observations") as string).slice(0, 1000),
    };

    const { error } = await supabase
        .from("bookings")
        .update(updateData)
        .eq("id", reservationId)
        .select()
        .single();

    if (error) throw new Error("Booking could not be updated");

    revalidatePath("/account/reservations");
    revalidatePath(`/account/reservations/edit/${reservationId}`);

    redirect("/account/reservations");
}

export async function createReservation(
    reservationData: FormData,
    formData: FormData,
) {
    const session = await auth();
    if (!session) throw new Error("You must be logged in");

    const cabinId = Number(reservationData.get("cabinId"));

    // Validating dates
    const bookedDates = await getBookedDatesByCabinId(cabinId);
    const startDate = new Date(reservationData.get("startDate") as string);
    const endDate = new Date(reservationData.get("endDate") as string);
    if (isPast(startDate) || isPast(endDate))
        throw new Error("Dates selected are in the past");
    for (let index = 0; index < bookedDates.length; index++) {
        if (
            isWithinInterval(bookedDates[index], {
                start: startDate,
                end: endDate,
            })
        )
            throw new Error("Dates already booked");
    }

    const newReservation = {
        guestId: session.user.guestId,
        observations: formData.get("observations")?.slice(0, 1000) as string,
        extrasPrice: 0,
        isPaid: false,
        hasBreakfast: false,
        status: "unconfirmed",
        numGuests: Number(formData.get("numGuests")),
        totalPrice: Number(reservationData.get("cabinPrice")),
        numNights: Number(reservationData.get("numNights")),
        cabinPrice: Number(reservationData.get("cabinPrice")),
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        cabinId,
    };

    const { error } = await supabase.from("bookings").insert([newReservation]);

    if (error) throw new Error("Booking could not be created");

    revalidatePath(`/cabins/${reservationData.get("cabinId")}`);

    redirect("/cabins/thankyou");
}
