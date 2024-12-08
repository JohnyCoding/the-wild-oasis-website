"use client";
import {
    createContext,
    Dispatch,
    ReactNode,
    SetStateAction,
    use,
    useState,
} from "react";
import { DateRange } from "react-day-picker";

type ReservationContextValues = {
    range: DateRange | undefined;
    setRange: Dispatch<SetStateAction<DateRange | undefined>>;
    resetRange: () => void;
};

const ReservationContext = createContext<ReservationContextValues | undefined>(
    undefined,
);

const initialState = {
    from: undefined,
    to: undefined,
};

export function ReservationProvider({ children }: { children: ReactNode }) {
    const [range, setRange] = useState<DateRange | undefined>(initialState);
    const resetRange = () => setRange(initialState);

    return (
        <ReservationContext.Provider value={{ range, setRange, resetRange }}>
            {children}
        </ReservationContext.Provider>
    );
}

export function useReservation() {
    const context = use(ReservationContext);

    if (context === undefined)
        throw new Error("ReservationContext was used outside of provider");

    return context;
}
