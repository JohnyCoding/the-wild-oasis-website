import NextAuth, { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import { createGuest, getGuest } from "@/app/_lib/data-service";
import { CreateGuestData } from "@/types/types";

const authConfig = {
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
        }),
    ],
    callbacks: {
        authorized({ auth }) {
            return !!auth?.user;
        },
        async signIn({ user }) {
            try {
                const existingGuest = await getGuest(user.email ?? "");

                if (!existingGuest)
                    await createGuest({
                        email: user.email,
                        fullName: user.name,
                    } as CreateGuestData);

                return true;
            } catch {
                return false;
            }
        },
        async session({ session }) {
            const guest = await getGuest(session.user.email);
            session.user.guestId = guest.id;
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
} satisfies NextAuthConfig;

export const {
    auth,
    signIn,
    signOut,
    handlers: { GET, POST },
} = NextAuth(authConfig);