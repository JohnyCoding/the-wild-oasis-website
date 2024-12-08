"use client";
import { useTransition } from "react";
import { TrashIcon } from "@heroicons/react/24/solid";

import SpinnerMini from "@/app/_components/SpinnerMini";

function DeleteReservation({
    bookingId,
    onDelete,
}: {
    bookingId: number;
    onDelete: (bookingId: number) => void;
}) {
    const [isPending, startTransition] = useTransition();

    function handleDelete() {
        if (confirm("Are you sure you want to delete this reservation?"))
            startTransition(() => onDelete(bookingId));
    }

    return (
        <button
            id={String(bookingId)}
            onClick={handleDelete}
            disabled={isPending}
            className="group flex flex-grow items-center gap-2 px-3 text-xs font-bold uppercase text-primary-300 transition-colors hover:bg-accent-600 hover:text-primary-900"
        >
            {isPending ? (
                <span className="mx-auto">
                    <SpinnerMini />
                </span>
            ) : (
                <>
                    <TrashIcon className="h-5 w-5 text-primary-600 transition-colors group-hover:text-primary-800" />
                    <span className="mt-1">Delete</span>
                </>
            )}
        </button>
    );
}

export default DeleteReservation;