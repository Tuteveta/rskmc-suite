import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type SharedData } from '@/types';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Droplets, LayoutGrid, Package, Users, DollarSign, Heart, Cross, ClipboardList, HardDrive } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    { title: 'Dashboard', url: '/dashboard', icon: LayoutGrid },
];

const recordsNavItems: NavItem[] = [
    { title: 'Members',          url: '/members',          icon: Users },
    { title: 'Baptism Records',  url: '/baptism-records',  icon: Droplets },
    { title: 'Marriage Records', url: '/marriage-records', icon: Heart },
    { title: 'Funeral Records',  url: '/funeral-records',  icon: Cross },
];

const financialNavItems: NavItem[] = [
    { title: 'Tithes & Offerings', url: '/tithes', icon: DollarSign },
];

const assetsNavItems: NavItem[] = [
    { title: 'Assets', url: '/assets', icon: Package },
];

const adminNavItems: NavItem[] = [
    { title: 'User Management', url: '/users',       icon: BookOpen },
    { title: 'Audit Log',       url: '/audit-logs',  icon: ClipboardList },
    { title: 'Backup & Restore',url: '/backup',      icon: HardDrive },
];

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const role = String(auth.user?.role ?? '');

    const canAccessModules = ['admin', 'administrator', 'data_entry_officer'].includes(role);
    const isAdmin = ['admin', 'administrator'].includes(role);

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
                {canAccessModules && (
                    <>
                        <NavMain items={recordsNavItems} />
                        <NavMain items={financialNavItems} />
                        <NavMain items={assetsNavItems} />
                    </>
                )}
                {isAdmin && <NavMain items={adminNavItems} />}
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
