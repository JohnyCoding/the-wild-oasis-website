import { eachDayOfInterval } from "date-fns";
import { notFound } from "next/navigation";

import { supabase } from "@/app/_lib/supabase";
import {
    BookingData,
    CabinData,
    CountryData,
    CreateGuestData,
    GuestBookingData,
    GuestData,
    SettingsData,
} from "@/types/types";

export async function getCabin(id: number) {
    const { data, error } = await supabase
        .from("cabins")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        console.error(error);
        notFound();
    }

    return data as CabinData;
}

export const getCabins = async function () {
    const { data, error } = await supabase
        .from("cabins")
        .select("id, name, maxCapacity, regularPrice, discount, image")
        .order("name");

    if (error) throw new Error("Cabins could not be loaded");

    return data as CabinData[];
};

export async function getGuest(email: string) {
    const { data } = await supabase
        .from("guests")
        .select("*")
        .eq("email", email)
        .single();

    return data as GuestData;
}

export async function getBooking(id: number) {
    const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("id", id)
        .single();

    if (error) throw new Error("Booking could not get loaded");

    return data as BookingData;
}

export async function getBookings(guestId: number) {
    const { data, error } = await supabase
        .from("bookings")
        .select(
            "id, created_at, startDate, endDate, numNights, numGuests, totalPrice, guestId, cabinId, cabins(name, image)",
        )
        .eq("guestId", guestId)
        .order("startDate");

    if (error) throw new Error("Bookings could not get loaded");

    return data as GuestBookingData[];
}

export async function getBookedDatesByCabinId(cabinId: number) {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const todayString = today.toISOString();

    const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("cabinId", cabinId)
        .or(`startDate.gte.${todayString},status.eq.checked-in`);

    if (error) throw new Error("Bookings could not get loaded");

    const bookedDates = data
        .map((booking) => {
            return eachDayOfInterval({
                start: new Date(booking.startDate as string),
                end: new Date(booking.endDate as string),
            });
        })
        .flat();

    return bookedDates;
}

export async function getSettings() {
    const { data, error } = await supabase
        .from("settings")
        .select("*")
        .single();

    if (error) {
        console.error(error);
        throw new Error("Settings could not be loaded");
    }

    return data as SettingsData;
}

export async function getCountries() {
    try {
        const res = await fetch(
            "https://restcountries.com/v2/all?fields=name,flag",
        );
        const countries = (await res.json()) as CountryData[];
        return countries;
    } catch {
        throw new Error("Could not fetch countries");
    }
}

export async function createGuest(newGuest: CreateGuestData) {
    const { data, error } = await supabase.from("guests").insert([newGuest]);

    if (error) throw new Error("Guest could not be created");

    return data;
}
