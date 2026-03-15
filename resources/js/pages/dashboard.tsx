import { Head, Link } from '@inertiajs/react';
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
                    <Link 
                        href="/ai-chat" 
                        className="relative flex flex-col items-center justify-center aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-white dark:bg-neutral-900 shadow-sm transition-all hover:shadow-md hover:border-blue-300 group"
                    >
                        <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">{chatCount}</div>
                        <div className="mt-2 text-sm font-medium text-neutral-500 underline decoration-blue-500/30 underline-offset-4 group-hover:text-blue-600">Total AI Chats</div>
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}
