import { Metadata } from "next";
import { auth } from "../_lib/auth";

export const metadata: Metadata = {
    title: "Guest area",
};

export default async function Page() {
    const session = await auth();
    console.log(session);

    return (
        <h2 className="mb-7 text-2xl font-semibold text-accent-400">
            Welcome, {session?.user?.name}
        </h2>
    );
}
