# Bugbot rules

## Double borders on elevated surfaces

Flag any elevated surface (card, dialog, modal, popover, dropdown, menu,
tooltip, sheet, toast) that puts a `border-*` or `ring-*` utility and a
`shadow-*` utility on the **same element**. This renders a double-border
artifact: the border paints a hard 1px stroke and the shadow's outer edge sits
just beside it, so the edge reads as two stacked lines.

**Fix:** replace the border/ring + shadow pair with a single
`smooth-shadow-ring-{size}` utility from shadow-plugin, which bakes a 1px
hairline ring into the shadow's final layer. Do not leave a `border` or `ring`
on an element that already uses `smooth-shadow-ring-*`. The ring is already in
there and a second edge doubles up.

- Flag: `class="rounded-xl border border-neutral-200 shadow-md"`
- Suggest: `class="rounded-xl smooth-shadow-ring-md"`

Sizes: `smooth-shadow-ring-xs`, `-sm`, `-md` (or bare `smooth-shadow-ring`),
`-lg`, `-xl`, `-2xl`. Tint the ring and shadow independently with
`smooth-ring-{color}` and `shadow-{color}`.
