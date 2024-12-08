import { getBookedDatesByCabinId, getCabin } from "@/app/_lib/data-service";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ cabinId: string }> },
) {
    const { cabinId } = await params;
    try {
        const [cabin, bookedDates] = await Promise.all([
            getCabin(Number(cabinId)),
            getBookedDatesByCabinId(Number(cabinId)),
        ]);
        return Response.json({ cabin, bookedDates });
    } catch {
        return Response.json({ message: "Cabin not found" });
    }
}
