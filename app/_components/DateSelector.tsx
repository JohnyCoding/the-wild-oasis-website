"use client";
import { DateRange, DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

import { CabinData, SettingsData } from "@/types/types";
import { useReservation } from "./ReservationContext";
import {
    differenceInDays,
    isPast,
    isSameDay,
    isWithinInterval,
} from "date-fns";

type Props = {
    settings: SettingsData;
    bookedDates: Date[];
    cabin: CabinData;
};

function isAlreadyBooked(range: DateRange | undefined, datesArr: Date[]) {
    return (
        range?.from &&
        range?.to &&
        datesArr.some((date) =>
            isWithinInterval(date, { start: range.from!, end: range.to! }),
        )
    );
}

export default function DateSelector({ settings, bookedDates, cabin }: Props) {
    const { range, setRange, resetRange } = useReservation();

    const displayRange = isAlreadyBooked(range, bookedDates)
        ? ({} as DateRange)
        : range;

    const { regularPrice, discount } = cabin;
    const numNights =
        displayRange?.to && displayRange?.from
            ? differenceInDays(displayRange.to, displayRange.from)
            : 0;
    const cabinPrice = (regularPrice - discount) * numNights;
    const { minBookingLength, maxBookingLength } = settings;

    const newDate = new Date();

    return (
        <div className="flex flex-col justify-between">
            <DayPicker
                className="place-self-center pt-12"
                mode="range"
                onSelect={(range) => setRange(range)}
                selected={displayRange}
                min={minBookingLength}
                max={maxBookingLength}
                startMonth={newDate}
                endMonth={new Date(newDate.getFullYear() + 5, 0)}
                captionLayout="dropdown"
                numberOfMonths={2}
                disabled={(curDate) =>
                    isPast(curDate) ||
                    bookedDates.some((date) => isSameDay(date, curDate))
                }
                excludeDisabled
                footer={`Minimum stay is ${minBookingLength} nights`}
            />

            <div className="flex h-[72px] items-center justify-between bg-accent-500 px-8 text-primary-800">
                <div className="flex items-baseline gap-6">
                    <p className="flex items-baseline gap-2">
                        {discount > 0 ? (
                            <>
                                <span className="text-2xl">
                                    ${regularPrice - discount}
                                </span>
                                <span className="font-semibold text-primary-700 line-through">
                                    ${regularPrice}
                                </span>
                            </>
                        ) : (
                            <span className="text-2xl">${regularPrice}</span>
                        )}
                        <span className="">/night</span>
                    </p>
                    {numNights ? (
                        <>
                            <p className="bg-accent-600 px-3 py-2 text-2xl">
                                <span>&times;</span> <span>{numNights}</span>
                            </p>
                            <p>
                                <span className="text-lg font-bold uppercase">
                                    Total
                                </span>{" "}
                                <span className="text-2xl font-semibold">
                                    ${cabinPrice}
                                </span>
                            </p>
                        </>
                    ) : null}
                </div>

                {range?.from || range?.to ? (
                    <button
                        className="border border-primary-800 px-4 py-2 text-sm font-semibold"
                        onClick={resetRange}
                    >
                        Clear
                    </button>
                ) : null}
            </div>
        </div>
    );
}
