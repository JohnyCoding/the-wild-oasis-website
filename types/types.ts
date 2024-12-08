export type CabinData = {
    id: number;
    name: string;
    maxCapacity: number;
    regularPrice: number;
    discount: number;
    description: string;
    image: string;
};

export type BookingData = {
    id: number;
    created_at: string;
    startDate: string;
    endDate: string;
    numNights: number;
    numGuests: number;
    cabinPrice: number;
    extrasPrice: number;
    totalPrice: number;
    status: string;
    hasBreakfast: boolean;
    isPaid: boolean;
    observations: string;
    cabinId: number;
    guestId: number;
};

export type GuestBookingData = {
    id: number;
    created_at: string;
    startDate: string;
    endDate: string;
    numNights: number;
    numGuests: number;
    totalPrice: number;
    guestId: number;
    cabinId: number;
    cabins: {
        name: string;
        image: string;
    };
};

export type CountryData = {
    name: string;
    flag: string;
    independent: boolean;
};

export type SettingsData = {
    id: number;
    created_at: string;
    minBookingLength: number;
    maxBookingLength: number;
    maxGuestsPerBooking: number;
    breakfastPrice: number;
};

export type GuestData = {
    id: number;
    created_at: string;
    fullName: string;
    email: string;
    nationalID: string;
    nationality: string;
    countryFlag: string;
};

export type CreateGuestData = {
    email?: string | null;
    fullName?: string | null;
};

export enum CabinFilter {
    "all",
    "small",
    "medium",
    "large",
}
