import CabinCard from "@/app/_components/CabinCard";
import { getCabins } from "@/app/_lib/data-service";
import { CabinFilter } from "@/types/types";

export default async function CabinList({ filter }: { filter: CabinFilter }) {
    const cabins = await getCabins();

    if (!cabins.length) return null;

    let displayedCabins: typeof cabins;
    switch (filter) {
        case CabinFilter.small:
            displayedCabins = cabins.filter((cabin) => cabin.maxCapacity <= 3);
            break;
        case CabinFilter.medium:
            displayedCabins = cabins.filter(
                (cabin) => cabin.maxCapacity > 3 && cabin.maxCapacity < 8,
            );
            break;
        case CabinFilter.large:
            displayedCabins = cabins.filter((cabin) => cabin.maxCapacity >= 8);
            break;
        case CabinFilter.all:
        default:
            displayedCabins = cabins;
            break;
    }

    return (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-14">
            {displayedCabins.map((cabin) => (
                <CabinCard cabin={cabin} key={cabin.id} />
            ))}
        </div>
    );
}
