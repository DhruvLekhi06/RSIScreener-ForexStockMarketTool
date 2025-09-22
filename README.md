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

