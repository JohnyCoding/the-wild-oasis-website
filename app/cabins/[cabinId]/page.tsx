import { Suspense } from "react";

import Reservation from "@/app/_components/Reservation";
import Spinner from "@/app/_components/Spinner";
import Cabin from "@/app/_components/Cabin";
import { getCabin, getCabins } from "@/app/_lib/data-service";

type Props = {
    params: Promise<{ cabinId: number }>;
};

export async function generateMetadata({ params }: Props) {
    const { name } = await getCabin((await params).cabinId);
    return {
        title: `Cabin ${name}`,
    };
}

export async function generateStaticParams() {
    const cabins = await getCabins();
    const ids = cabins.map((cabin) => ({ cabinId: String(cabin.id) }));
    return ids;
}

export default async function Page({ params }: Props) {
    const cabin = await getCabin((await params).cabinId);

    return (
        <div className="mx-auto mt-8 max-w-6xl">
            <Cabin cabin={cabin} />

            <div>
                <h2 className="mb-10 text-center text-5xl font-semibold">
                    Reserve {cabin.name} today. Pay on arrival.
                </h2>

                <Suspense fallback={<Spinner />}>
                    <Reservation cabin={cabin} />
                </Suspense>
            </div>
        </div>
    );
}
