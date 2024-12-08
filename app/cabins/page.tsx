import { Metadata } from "next";
import { Suspense } from "react";

import CabinList from "@/app/_components/CabinList";
import Spinner from "@/app/_components/Spinner";
import Filter from "@/app/_components/Filter";
import ReservationReminder from "@/app/_components/ReservationReminder";
import { CabinFilter } from "@/types/types";

export const metadata: Metadata = {
    title: "Cabins",
};

export default async function Page({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const filter = ((await searchParams).capacity as string) ?? "all";
    const filterEnum = CabinFilter[filter as keyof typeof CabinFilter];

    return (
        <div>
            <h1 className="mb-5 text-4xl font-medium text-accent-400">
                Our Luxury Cabins
            </h1>
            <p className="mb-10 text-lg text-primary-200">
                Cozy yet luxurious cabins, located right in the heart of the
                Italian Dolomites. Imagine waking up to beautiful mountain
                views, spending your days exploring the dark forests around, or
                just relaxing in your private hot tub under the stars. Enjoy
                nature&apos;s beauty in your own little home away from home. The
                perfect spot for a peaceful, calm vacation. Welcome to paradise.
            </p>
            <div className="mb-8 flex justify-end">
                <Filter />
            </div>
            <Suspense fallback={<Spinner />} key={filter}>
                <CabinList filter={filterEnum} />
                <ReservationReminder />
            </Suspense>
        </div>
    );
}
