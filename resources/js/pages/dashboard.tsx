import { Head } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
    },
];

export default function Dashboard({ chatCount }: { chatCount: number }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="relative flex flex-col items-center justify-center aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-white dark:bg-neutral-900 shadow-sm transition-all hover:shadow-md">
                        <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">{chatCount}</div>
                        <div className="mt-2 text-sm font-medium text-neutral-500 underline decoration-blue-500/30 underline-offset-4">Total AI Chats</div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
