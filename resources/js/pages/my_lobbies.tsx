import AppLayout from '@/layouts/app-layout';
import {Lobby, type BreadcrumbItem, PaginatedData} from '@/types';
import {Head, Link} from '@inertiajs/react';
import {Frown} from "lucide-react";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {Button} from "@/components/ui/button";
import {route} from "ziggy-js";
import {LobbiesList} from "@/components/lobbies-list";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'My requests',
        href: '/my-requests',
    },
];

export default function MyRequests({ lobbies } : { lobbies: PaginatedData<Lobby> }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My lobbies" />
            <div className="flex-col px-4 py-8">
                {lobbies.data.length === 0 ? (
                    <Alert>
                        <Frown/>
                        <AlertTitle>You don't have any lobbies at the moment!</AlertTitle>
                        <AlertDescription>
                            You can create a new one <Link className="text-violet-500" href={route('lobbies.store')}>here</Link>.
                        </AlertDescription>
                    </Alert>
                ) : (
                    <LobbiesList lobbies={lobbies} />
                )}
            </div>
        </AppLayout>
    );
}
