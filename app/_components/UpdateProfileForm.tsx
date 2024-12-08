import Image from "next/image";

import SubmitButton from "@/app/_components/SubmitButton";
import { GuestData } from "@/types/types";
import { updateGuest } from "@/app/_lib/actions";

export default function UpdateProfileForm({
    children,
    guest,
}: {
    children: React.ReactNode;
    guest: GuestData;
}) {
    const { fullName, email, nationalID, countryFlag } = guest;

    return (
        <form
            action={updateGuest}
            className="flex flex-col gap-6 bg-primary-900 px-12 py-8 text-lg"
        >
            <div className="space-y-2">
                <label htmlFor="fullName">Full name</label>
                <input
                    disabled
                    id="fullName"
                    name="fullName"
                    defaultValue={fullName}
                    className="w-full rounded-sm bg-primary-200 px-5 py-3 text-primary-800 shadow-sm disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-400"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="email">Email address</label>
                <input
                    disabled
                    id="email"
                    name="email"
                    defaultValue={email}
                    className="w-full rounded-sm bg-primary-200 px-5 py-3 text-primary-800 shadow-sm disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-400"
                />
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <label htmlFor="nationality">Where are you from?</label>
                    <Image
                        src={countryFlag}
                        width={40}
                        height={20}
                        alt="Country flag"
                        className="h-5 rounded-sm"
                    />
                </div>

                {children}
            </div>

            <div className="space-y-2">
                <label htmlFor="nationalID">National ID number</label>
                <input
                    name="nationalID"
                    id="nationalID"
                    defaultValue={nationalID}
                    className="w-full rounded-sm bg-primary-200 px-5 py-3 text-primary-800 shadow-sm"
                />
            </div>

            <div className="flex items-center justify-end gap-6">
                <SubmitButton pendingLabel="Updating...">
                    Update profile
                </SubmitButton>
            </div>
        </form>
    );
}
