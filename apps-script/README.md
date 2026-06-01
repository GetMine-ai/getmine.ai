# Waitlist + Beta gate — Google Sheets + Apps Script

The landing page form at `index.html` POSTs to a Google Apps Script web app
which handles three modes against the same Google Sheet:

| Mode | Triggered by | What it does |
|---|---|---|
| `waitlist` (default) | Hero / nav "Join the waitlist" form | Appends to `Waitlist` tab |
| `check_beta` | "Beta Users" nav modal | Looks up email in `Beta_Allowlist`, returns `{allowed, name, cohort}`, logs attempt |
| `log_download` | OS download buttons in unlocked install view | Appends to `Beta_Access_Log` |

All three sheet tabs are created automatically on first use with the right headers.

## One-time setup

### 1. Create the Sheet

Create a new Google Sheet — name it whatever you like (e.g. `GetMine Waitlist`).
The script will auto-create a `Waitlist` tab with headers on the first submission.

### 2. Add the script

1. In the Sheet, open **Extensions → Apps Script**.
2. Delete the default `Code.gs` contents and paste the contents of
   [`Code.gs`](./Code.gs) from this repo.
3. **Save** (disk icon).

### 3. Deploy as a web app

1. **Deploy → New deployment**.
2. Click the gear icon → select **Web app**.
3. Fill in:
   - **Description:** `Web signup` (anything)
   - **Execute as:** `Me`
   - **Who has access:** `Anyone` ← **must be this, not "Anyone with Google account"**
4. Click **Deploy**.
5. You'll be prompted to authorise. During auth you may see
   *"Google hasn't verified this app"* — click **Advanced → Go to \<project\> (unsafe) → Allow**.
   This is normal for personal Apps Scripts; it just means Google hasn't audited your own code.
6. Copy the **`/exec` URL** at the end of the dialog.

### 4. Wire it into the site

Edit `index.html` and replace the value of `WAITLIST_ENDPOINT` (near the top of
the `<script>` block, search for `WAITLIST_ENDPOINT=`) with your `/exec` URL,
then commit and push.

### 5. Test

Open the `/exec` URL in an **incognito window**. It should show:

> GetMine waitlist endpoint is live.

If it shows *"You need access"*, the deployment isn't public — see the
**Workspace gotcha** below.

Then submit the form on the live site. The first submission creates the
`Waitlist` tab and headers automatically.

## ⚠️ Google Workspace gotcha

If your Google account is on a **Workspace domain** (e.g. `@yourcompany.com`
rather than `@gmail.com`), the domain admin policy often **silently overrides
"Anyone"** and scopes the web app to the organisation only. The deployment
dialog gives no warning.

Symptoms:

- The `/exec` URL returns HTTP 403 "You need access" in an incognito window.
- Form submissions fail silently (the UI still shows the confirmation because
  `fetch` is fire-and-forget).

Fixes, easiest first:

1. **Create the Apps Script under a personal `@gmail.com` account instead.**
   The Sheet itself can live anywhere; it's the script account that matters.
2. Ask the Workspace admin to allow anonymous access to Apps Script web apps
   (admin.google.com → Apps → Google Workspace → Drive and Docs → Sharing settings).
3. Use a different form backend (e.g. Formspree, Tally, Airtable).

## Sheet schemas

### `Waitlist` tab — *auto-populated*

| Column | Source |
|---|---|
| `timestamp` | Server time when the row was appended |
| `name` | `hw-name` input |
| `email` | `hw-email` input |
| `phone` | `hw-phone` input (optional) |
| `q1_household` | "Just me" / "Me & Family" |
| `q2_nhs_app` | "NHS App" / "NHS only" |
| `q3_care_mix` | "NHS only" / "NHS & Private" |
| `q4_insurance` | "Insured" / "No insurance" |
| `q5_wearables` | "Fitness tracker" / "Sleep tracker" / "Smart watch" / "No wearables" |
| `user_agent` | Browser UA string |
| `referrer` | `document.referrer` |

### `Beta_Allowlist` tab — *you populate this manually*

Add one row per beta participant. The gate is case-insensitive and trims
whitespace, so don't worry about exact capitalisation of the email.

| Column | Required | Notes |
|---|---|---|
| `email` | yes | The address the participant signs in with on the gate |
| `name` | optional | Greeted by name in the unlocked view ("Welcome, Sabine") |
| `cohort` | optional | e.g. `wave-2`, `wave-3`. Shown in the unlocked view |
| `status` | yes | `active` (gate opens) or `revoked` (gate refuses) |
| `added_at` | optional | When you added them — for your own records |
| `notes` | optional | Free text, your eyes only |

To revoke access for a participant: change `status` from `active` to `revoked`.
No code change or redeploy needed.

### `Beta_Access_Log` tab — *auto-populated*

Every gate attempt and every download click is logged here.

| Column | Notes |
|---|---|
| `timestamp` | Server time |
| `mode` | `check_beta` (gate attempt) or `download` (button click in unlocked view) |
| `email` | What the visitor typed (for `check_beta`) or the verified email (for `download`) |
| `allowed` | `yes` / `no` for `check_beta`; blank for `download` rows |
| `os` | Set on `download` rows: `mac` / `windows` / `linux` |
| `user_agent` | Browser UA |
| `referrer` | `document.referrer` |

## Updating the script later

If you edit `Code.gs` after the initial deploy, you must **Deploy → Manage
deployments → (pencil) → Version: New version → Deploy** to publish the
change. The `/exec` URL stays the same.
