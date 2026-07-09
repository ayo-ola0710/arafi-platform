<div align="center">

# Arafi

### Payment Logic as a Service

**The missing layer between your app and your payment gateway.**

[Documentation](https://arafi-platform.vercel.app/docs) · [API Reference](https://arafi-platform.vercel.app/docs) · [Dashboard](https://arafi-platform.vercel.app/login)

</div>

---

## 👨‍⚖️ HACKATHON JUDGE DEMO CREDENTIALS

To access the Arafi Dashboard and test the application, log in with the following global demo credentials:

* **Email**: `judge@nomba.com`
* **Password**: `nomba2026`

Use these credentials to log in at [https://arafi-platform.vercel.app/login](https://arafi-platform.vercel.app/login) (or your local dashboard instance).

---

## The Problem with Payments Today

Payment gateways like Nomba, Paystack, and Stripe solve **money movement** — getting funds from A to B. What they don't solve is **money logic** — everything that happens before and after.

Every developer building a SaaS, marketplace, or subscription product ends up writing the same complex, high-stakes code:

- Subscription renewal engines with dunning and grace periods
- Escrow hold, release, and dispute flows
- Virtual account management and balance reconciliation
- Webhook retry handling and idempotency
- Double-entry ledgers to prevent floating-point drift
- Card vaulting and tokenized re-billing

**One wrong line of code in any of these means real money lost.** Arafi takes all of this off your plate.

---

## What Arafi Is

Arafi is a **Payment Logic as a Service (PLaaS)** platform. You bring the payment rails (we run on Nomba). Arafi manages the state, the accounting, and the intelligence on top.

> **Nomba** is to **Arafi** what card networks are to Stripe.  
> **Arafi** is to your app what Stripe is to eCommerce.

You call one API. Arafi handles the rest.

---

## What You Can Build with Arafi

### 💳 Recurring Subscriptions
Create billing plans in any currency, subscribe customers with a single API call, and let Arafi manage the entire lifecycle — renewals, retries, pauses, cancellations, and prorated plan upgrades — automatically.

```bash
# Create a plan
POST /v1/plans
{ "name": "Pro", "amountKobo": 1500000, "interval": "monthly" }

# Subscribe a customer — Arafi handles everything from here
POST /v1/subscriptions
{ "customerId": "...", "planId": "...", "paymentMethod": "CARD" }
```

### 🏦 One-Time Payments
Trigger a single charge against a customer's vaulted card or generate a Nomba checkout link on demand. No recurring commitment, no extra plumbing.

### 🔐 Escrow & Milestone Payments
Hold funds in isolated virtual accounts scoped to a specific transaction or agreement. Release funds programmatically when conditions are met — or lock them for dispute resolution. Perfect for marketplaces, freelance platforms, and event vendors.

### 💰 Virtual Account Provisioning
Provision dedicated Nomba virtual bank accounts for your customers in a single API call. Arafi automatically reconciles inbound transfers and maps credits to the correct ledger.

### 📒 Immutable Ledger & Payouts
Every credit and debit is recorded in an append-only ledger. Balances are computed — never stored — eliminating reconciliation errors. When you're ready to settle, one API call triggers the payout via Nomba transfer.

---

## The SDK — Arafi Everywhere

### JavaScript / TypeScript Frontend SDK *(Coming Soon)*

Drop Arafi into your frontend with a few lines. The SDK handles checkout flows, subscription status checks, and card tokenization — no backend required for read operations.

```typescript
import { ArAfi } from '@arafi/js'

const arafi = new ArAfi({ publishableKey: 'arafi_test_...' })

// Launch a Nomba checkout for a customer
const { checkoutUrl } = await arafi.subscriptions.create({
  customerId: 'cus_...',
  planId: 'plan_...',
  paymentMethod: 'CARD'
})

window.location.href = checkoutUrl
```

### Backend Adapter — Direct DB Sync *(Coming Soon)*

Inspired by BetterAuth, the Arafi backend adapter connects directly to your database and updates payment state tables for you. You define the columns. Arafi keeps them in sync.

```typescript
// arafi.config.ts
import { ArAfiAdapter } from '@arafi/adapter-prisma'

export default {
  secret: process.env.ARAFI_SECRET,
  adapter: ArAfiAdapter({
    db: prisma,
    // Arafi writes directly to your subscription table
    mapping: {
      subscriptions: {
        table: 'user_subscriptions',
        statusColumn: 'is_active',
        planColumn: 'plan_name',
        periodEndColumn: 'expires_at'
      }
    }
  })
}
```

When a payment is confirmed via webhook, Arafi's adapter updates `user_subscriptions.is_active = true` in your database automatically. You write zero webhook handler code.

---

## How It Works

```
Your App                Arafi                      Nomba
   │                      │                          │
   │── Subscribe ─────────>│                          │
   │                       │── Provision account ────>│
   │<── Account details ───│                          │
   │                       │                          │
   │   (Customer pays)     │<── Transfer webhook ─────│
   │                       ├─ Verify signature         │
   │                       ├─ Update subscription      │
   │                       ├─ Write ledger credit      │
   │                       │                          │
   │<── subscription.active│
   │                       │
[Your DB updates itself via the Arafi adapter]
```

---

## Core Features

| Feature | Description |
|---|---|
| **Subscriptions** | Monthly, yearly, one-time — with full pause, resume, cancel and plan change |
| **Escrow** | Virtual account-backed holds with programmatic release and dispute states |
| **One-time Payments** | Single card charges or bank transfer prompts with no subscription binding |
| **Card Vaulting** | Tokenize cards once via Nomba checkout, charge silently on every renewal |
| **Immutable Ledger** | Append-only double-entry accounting — balances computed, never stored |
| **Merchant Webhooks** | Signed outbound webhooks to your app with exponential backoff retries |
| **Payouts** | On-demand settlements to any Nigerian bank account via Nomba transfers |
| **Multi-tenancy** | Full workspace isolation — multiple apps, separate Test and Live environments |
| **Frontend SDK** | Drop-in JS/TS SDK for checkout and subscription status *(coming soon)* |
| **DB Adapter** | Direct database sync adapter — your tables stay current automatically *(coming soon)* |

---

## Authentication

Arafi uses two modes of access:

**Dashboard (human users)**  
Log in via email + password, receive a short-lived JWT for managing your workspace.

**API Keys (machine access)**  
Every workspace ships with a Test key and a Live key. Pass either as a Bearer token.

```
Authorization: Bearer arafi_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
Authorization: Bearer arafi_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Test mode — safe sandboxing, fake money.  
Live mode — real money, real Nomba rails.

---

## Why Arafi

### For Developers
Stop writing billing infrastructure. Arafi's API is opinionated, minimal, and impossible to get wrong. Five API calls to go from zero to a fully-managed recurring billing product.

### For Platforms and Marketplaces
Escrow, milestone releases, and multi-party payouts are hard. Arafi makes them a configuration decision, not an engineering project.

### For the Nigerian Developer Ecosystem
Built natively on Nomba — the first PLaaS platform designed from the ground up for Nigerian banking rails, NGN denominations, and bank-transfer-first payment behaviour.

---

## Powered By

Built on top of [Nomba](https://nomba.com) — Nigeria's financial infrastructure platform.

---

<div align="center">

**Arafi** · Payment Logic as a Service · Built for Nomba Hackathon 2026

</div>
