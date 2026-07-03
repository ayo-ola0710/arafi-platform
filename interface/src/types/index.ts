// ─── Auth ────────────────────────────────────────────────────────────────────
export interface User {
    id: string;
    name: string;
    email: string;
    app_count: number;
}

export interface AuthResponse {
    access_token: string;
    app_count: number;
}

// ─── Workspaces ──────────────────────────────────────────────────────────────
export interface Workspace {
    status: string;
    app_id: string;
    app_name: string;
    sandbox_key: string;
    live_key: string;
}

// ─── Balances ────────────────────────────────────────────────────────────────
export interface Balance {
    currency: string;
    app_id: string;
    available_balance: number;
    environment_mode: string;
}

// ─── Plans ───────────────────────────────────────────────────────────────────
export interface Plan {
    id: string;
    name: string;
    interval: string;          // e.g. "monthly", "weekly"
    amount_kobo: number;
    created_at: string;
}

export interface CreatePlanPayload {
    name: string;
    interval: string;
    amount_kobo: number;
}

// ─── Subscriptions ───────────────────────────────────────────────────────────
export interface Subscription {
    id: string;
    customer_id: string;
    plan_id: string;
    status: string;
    created_at: string;
}

export interface CreateSubscriptionPayload {
    customer_id: string;
    plan_id: string;
}

// ─── Customers ───────────────────────────────────────────────────────────────
export interface Customer {
    id: string;
    email: string;
    external_ref: string;
    created_at: string;
}

export interface CreateCustomerPayload {
    email: string;
    external_ref: string;
}

// ─── Virtual Accounts ────────────────────────────────────────────────────────
export interface VirtualAccount {
    id: string;
    account_name: string;
    account_number: string;
    bank_name: string;
    customer_ref: string;
    created_at: string;
}

export interface CreateVirtualAccountPayload {
    customer_ref: string;
    account_name: string;
}