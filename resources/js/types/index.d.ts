import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    url: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    username: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface PaginatedData<T = unknown> {
    current_page: number | null;
    data: T[];
    first_page_url: string | null;
    last_page_url: string | null;
    last_page: number | null;
    links: PaginationLink[];
    next_page_url: string | null;
    path: string | null;
    per_page: number | null;
    prev_page_url: string | null;
    from: string | null;
    to: string | null;
    total: number | null;
    [key: string]: unknown;
}

export interface LobbyCreator {
    id: number;
    username: string;
    osu_id: number;
    osu_avatar_url?: string;
}

export interface Lobby {
    id: number;
    name: string;
    mode: string;
    years: string | null;
    image: string;
    users: LobbyUser[];
    owner: LobbyCreator;
}

export interface LobbyUserPivot {
    is_admin: boolean;
    joined_at: string;
}

export interface LobbyUser {
    id: number;
    username: string;
    osu_id: number;
    osu_avatar_url?: string;
    pivot: LobbyUserPivot;
}

export interface LobbiesFiltersInterface {
    query?: string;
    mode?: "Standard" | "Mania" | "Catch" | "Taiko" | "Any";
    years?: string;
    status?: "approved" | "loved" | "Any";
    is_closed?: 0 | 1 | "Any";
}

