"use client";
import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { CabinFilter } from "@/types/types";

export default function Filter() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const activeFilter = searchParams.get("capacity") ?? "all";

    const createQueryString = useCallback(
        (filter: CabinFilter) => {
            const params = new URLSearchParams(searchParams);
            params.set("capacity", CabinFilter[filter]);
            return params.toString();
        },
        [searchParams],
    );

    return (
        <div className="flex border border-primary-800">
            <Button
                filter={CabinFilter[CabinFilter.all]}
                activeFilter={activeFilter}
                onClick={() => {
                    router.replace(
                        `${pathname}?${createQueryString(CabinFilter.all)}`,
                        {
                            scroll: false,
                        },
                    );
                }}
            >
                All cabins
            </Button>
            <Button
                filter={CabinFilter[CabinFilter.small]}
                activeFilter={activeFilter}
                onClick={() => {
                    router.replace(
                        `${pathname}?${createQueryString(CabinFilter.small)}`,
                        {
                            scroll: false,
                        },
                    );
                }}
            >
                1&mdash;3 guests
            </Button>
            <Button
                filter={CabinFilter[CabinFilter.medium]}
                activeFilter={activeFilter}
                onClick={() => {
                    router.replace(
                        `${pathname}?${createQueryString(CabinFilter.medium)}`,
                        {
                            scroll: false,
                        },
                    );
                }}
            >
                4&mdash;7 guests
            </Button>
            <Button
                filter={CabinFilter[CabinFilter.large]}
                activeFilter={activeFilter}
                onClick={() => {
                    router.replace(
                        `${pathname}?${createQueryString(CabinFilter.large)}`,
                        {
                            scroll: false,
                        },
                    );
                }}
            >
                8&mdash;12 guests
            </Button>
        </div>
    );
}

type ButtonProps = {
    onClick: () => void;
    children: React.ReactNode;
    filter: string;
    activeFilter: string;
};

function Button({ onClick, children, filter, activeFilter }: ButtonProps) {
    return (
        <button
            className={`px-5 py-2 hover:bg-primary-700 ${filter === activeFilter ? "bg-primary-700 text-primary-50" : ""}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
}
