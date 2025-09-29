import AppLayout from "@/layouts/app-layout";
import { Head } from "@inertiajs/react";
import {LobbiesList} from "@/components/lobbies-list";
import {PaginatedData, Lobby, BreadcrumbItem} from "@/types";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Dashboard",
        href: "/dashboard",
    },
];

export default function Dashboard({ lobbies }: { lobbies: PaginatedData<Lobby> }) {

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex flex-col px-4 py-8">
                <LobbiesList lobbies={lobbies} />
            </div>
        </AppLayout>
    );
}

