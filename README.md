# Forex RSI Screener (Pine Script v5)

**Purpose.**  
A compact, production-minded TradingView Pine Script indicator that scans Forex instruments for RSI-based signals. Includes:

- `Per-Symbol` mode (recommended): run this on any Forex chart to evaluate multi-timeframe RSI and generate alerts.
- `Multi-Symbol Table (Demo)` mode: a demo script that displays RSI values for a small curated basket (<= 8 symbols). Use only for demos due to TradingView limits.

This project is optimized for clarity, publishability, and the practical constraints of Pine Script (`request.security` limits, runtime, etc.).

---

# Contents

- `RSI_PerSymbol_Screener.pine` — Per-symbol, multi-timeframe RSI screener (production-ready).
- `RSI_MultiSymbol_Table_Demo.pine` — Multi-symbol small-basket demo table (<=8 symbols).
- `README.md` — This file.
- `publish_description.txt` — Short description text ready for TradingView publish form.
- `TEST_CHECKLIST.md` — Manual test checklist and validation steps.

---

# Features

- Multi-timeframe RSI (configurable primary and higher TFs; defaults H1 & H4).
- Signals: Bull (RSI > threshold), Bear (RSI < threshold), Cross50 events (configurable).
- `alertcondition()` hooks for Cross50, Bull and Bear events.
- Clean chart label and subtle background tint to show current status.
- Compact `table` demo for small baskets (documented limits).
- Clear input parameters with sensible defaults and tooltips.

---

# Why TradingView Pine Script?

- Fast prototyping inside the TradingView ecosystem.
- Easy alerting and integration with users’ existing watchlists and charts.
- Ideal for per-symbol scanning and publishing public indicators.
- Not suitable as the only infrastructure for a full-scale, multi-user, low-latency portal — see Limitations.

---

# Installation / Usage

## 1. Open TradingView Pine Editor
1. Go to TradingView → Chart → Pine Editor (bottom of the screen).
2. Create a new script and paste the contents of `RSI_PerSymbol_Screener.pine` (or the demo file).
3. Save the script with a clear name (e.g., `Forex RSI Screener — Per Symbol`).
4. Click "Add to Chart".

## 2. Configure inputs
- `RSI Length` (default: 14)  
- `Primary TF` (default: `60` for H1)  
- `Higher TF` (default: `240` for H4)  
- `Bullish RSI threshold` (default: 60)  
- `Bearish RSI threshold` (default: 40)  
- `Signal on RSI crossing 50?` (toggle)  

Adjust to taste. Save as default or create presets.

## 3. Create alerts
1. Once the script is on the chart, click the Alerts (clock) icon.
2. Under *Condition*, choose the indicator and the alert condition you want (e.g., `RSI Cross Up 50`).
3. Configure notification channel (popup/email/webhook).
4. Create alert.

---

# Multi-Symbol Demo Notes

- The demo uses `request.security` to pull RSI for multiple hardcoded symbols. TradingView limits the number of security calls and script runtime. Keep the demo list <= 8 symbols.
- Use the demo only to showcase a small curated watchlist. For scanning large universes, use Per-Symbol mode applied via watchlists or TradingView’s screener.

---

# Testing & Validation (quick checklist)

1. **Compile**: Script compiles in Pine v5 without errors.
2. **Basic signal tests**:
   - Apply to EURUSD H1; manually confirm RSI plotted equals TradingView RSI on the same timeframe.
   - Confirm status label shows Bull/Bear/Neutral correctly.
3. **Cross50 alerts**:
   - Set up an alert for `RSI Cross Up 50` and verify trigger during chart replay or on a test symbol.
4. **Multi-broker symbol checks**:
   - Apply the per-symbol script to symbols from different providers (OANDA, FXCM, IDEALPRO) to confirm symbol naming compatibility.
5. **Demo table**:
   - Test with 1, 4, and 8 symbols to watch for throttling or lag.
6. **Edge cases**:
   - Check behavior on weekend data gaps, DST boundary bars, and very thin pairs (e.g., exotic cross).
7. **Publish dry-run**:
   - Publish the script privately first. Check for any compile-time warnings flagged by TradingView’s publish flow.

See `TEST_CHECKLIST.md` for a full manual test script.

---

# Limitations & Gotchas (read this before crying)

- `request.security` call limits: Multi-symbol scripts are limited by the number of external symbol/timeframe calls. Don’t expect to scan hundreds of pairs inside a single Pine script.
- Platform gating: Some features or higher quote rates depend on TradingView plan tiers.
- Symbol naming: Broker prefixes vary (`OANDA:EURUSD` vs `FXCM:EURUSD`). Use instrument identifiers appropriate to the user’s broker or allow user overrides.
- Alert reliability: TradingView alert delivery is generally solid for retail use. For enterprise-grade alert delivery or guarantees (retries, guaranteed webhooks), run server-side alerting.
- RSI only: RSI alone can produce false positives. Consider combining with ATR, spread, or session filters for better precision.

---

# Recommended workflow / Best practices
