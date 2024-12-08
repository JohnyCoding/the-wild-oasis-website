import DateSelector from "@/app/_components/DateSelector";
import ReservationForm from "@/app/_components/ReservationForm";
import LoginMessage from "@/app/_components/LoginMessage";
import { getBookedDatesByCabinId, getSettings } from "@/app/_lib/data-service";
import { CabinData } from "@/types/types";
import { auth } from "@/app/_lib/auth";

export default async function Reservation({ cabin }: { cabin: CabinData }) {
    const [settings, bookedDates] = await Promise.all([
        getSettings(),
        getBookedDatesByCabinId(cabin.id),
    ]);

    const session = await auth();

    return (
        <div className="mb-10 grid min-h-[400px] grid-cols-2 border border-primary-800 text-accent-400">
            <DateSelector
                settings={settings}
                bookedDates={bookedDates}
                cabin={cabin}
            />
            {session?.user ? (
                <ReservationForm cabin={cabin} user={session.user} />
            ) : (
                <LoginMessage />
            )}
        </div>
    );
}
