# 2X Investing — Klaviyo sequence (best-practice setup)

The site pushes to Klaviyo automatically (managed in God Console → Klaviyo):

- **Opt-in trigger:** when someone **becomes a member**, we send a profile + a `2X Interest` event with `kind = member-signup`, and subscribe them to your marketing List.
- **Interest events:** every time a member opens an offering/product we send `2X Interest` with `kind = member-interest` and `interest = <offering title>`.
- **Download events:** downloading a doc sends `2X Interest` with `kind = download`.

## Build two flows in Klaviyo (Flows → Create → Metric-triggered):

1. **Welcome / Opt-in** — Trigger metric **"2X Interest"**, add a trigger filter `kind equals member-signup` (or trigger off the List's "Subscribed to List"). Email template: `welcome.html`.
2. **Interest follow-up** — Trigger metric **"2X Interest"**, filter `kind equals member-interest OR kind equals download`. Use `{{ event.interest }}` to personalize. Email template: `interest.html`. Add a 1-day delay + a smart-send-time step (best practice).

Both templates are dark/on-brand, ~600px single-column, inline-styled, with a preheader and `{% unsubscribe %}` footer. Paste the HTML into a Klaviyo template (Templates → Create → drag an HTML block, or use a code template).
