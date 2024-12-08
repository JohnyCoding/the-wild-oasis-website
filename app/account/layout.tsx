import SideNavigation from "@/app/_components/SideNavigation";

type Props = {
    children: React.ReactNode;
};

export default function Layout({ children }: Props) {
    return (
        <div className="grid h-full gap-12 md:grid-cols-[16rem_1fr]">
            <SideNavigation />
            <div className="py-1">{children}</div>
        </div>
    );
}
