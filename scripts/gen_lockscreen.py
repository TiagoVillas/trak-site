#!/usr/bin/env python3
"""Generate the static lock-screen calendar mockup for the trak-site hero.

Outputs an HTML fragment: 12 month blocks (Monday-first), one <i> per day.
Past days get class a (bright) / b (dark) pseudo-randomly and a staggered
animation delay --d in chronological order. Today (15/07/2026) is class t.
"""
import calendar
from datetime import date

YEAR = 2026
TODAY = date(2026, 7, 15)
MONTHS = ["jan", "fev", "mar", "abr", "mai", "jun",
          "jul", "ago", "set", "out", "nov", "dez"]

calendar.setfirstweekday(calendar.MONDAY)

STEP = 0.011   # s between cells
START = 0.35   # s before first cell

out = []
day_index = 0
for m in range(1, 13):
    first_wd, ndays = calendar.monthrange(YEAR, m)  # Monday=0
    cells = []
    cells.append(f'<b>{MONTHS[m-1]}</b>')
    cells.append('<span class="mg">')
    cells.append('<u></u>' * first_wd)  # leading gap cells
    for d in range(1, ndays + 1):
        dt = date(YEAR, m, d)
        if dt == TODAY:
            delay = START + day_index * STEP
            cells.append(f'<i class="t" style="--d:{delay:.2f}s"></i>')
            day_index += 1
        elif dt < TODAY:
            # deterministic bright/dark mix, ~55% bright
            cls = 'a' if (d * 7 + m * 3) % 9 < 5 else 'b'
            delay = START + day_index * STEP
            cells.append(f'<i class="{cls}" style="--d:{delay:.2f}s"></i>')
            day_index += 1
        else:
            cells.append('<i></i>')
    cells.append('</span>')
    out.append(f'<span class="mo">{"".join(cells)}</span>')

frag = '\n          '.join(out)
total = START + day_index * STEP
print(f'<!-- gerado por scripts/gen_lockscreen.py — {day_index} dias acesos, anim ~{total:.1f}s -->')
print(f'          {frag}')
