# RaamRegie design system

Clean, calm, corporate-modern. White surfaces on a light blue-gray background, hairline borders instead of heavy shadows, and the brand gradient used sparingly as the accent. The product is white-label: tenants change the two brand colors and the logo; everything else stays fixed.

## Principles

1. **Borders over shadows.** Cards and panels use a 1px `border-line`. Shadows only for things that float (dropdowns, modals, toasts).
2. **The gradient is an accent, not a background.** It marks brand and "you are here", nothing else.
3. **Never hardcode brand colors.** Always `primary` / `secondary` / `bg-brand`, so white-labeling works.
4. **One radius per element type.** See Shape.
5. **Quiet by default.** Muted gray for secondary things, navy `ink` for content, brand color only for interaction.

## Color tokens

| Token                                            | Use                                                                        |
| ------------------------------------------------ | -------------------------------------------------------------------------- |
| `primary`, `primary-hover`, `primary-soft`       | Brand (tenant-overridable). Focus rings, active states, links, soft tints. |
| `secondary`, `secondary-hover`, `secondary-soft` | Second brand color (tenant-overridable). Gradient end, info accents.       |
| `bg-brand` / `bg-brand-vertical`                 | The brand gradient.                                                        |
| `ink`                                            | Headings and body text.                                                    |
| `muted`                                          | Secondary text, icons, placeholders (`muted/60`).                          |
| `line`                                           | All borders and dividers.                                                  |
| `surface`                                        | Page background, hover backgrounds, table headers.                         |
| `success`, `warning`, `danger`                   | Status only. Never decorative.                                             |

Tenant colors are set on the app wrapper:
`style={{ "--brand-primary": company.primary_color, "--brand-secondary": company.secondary_color }}`
Tenant colors must keep white text readable (contrast ≥ 4.5:1); validate when a tenant saves them.

## Where the gradient goes (and nowhere else)

- Top bar
- Active nav indicator (3px bar, `bg-brand-vertical`)
- Login/auth accent details
- Loaders
- Selected states: the icon tile of a selected item (`bg-brand text-white`) and the selected check badge (`rounded-full bg-brand`), on top of a `bg-primary-soft` / `border-primary/40` item

Large areas (card backgrounds, page sections) never get the gradient; it stays on small, meaningful elements so it keeps standing out. **Buttons never use the gradient**; primary buttons are solid `bg-primary`.

## Shape

| Element                                         | Radius         |
| ----------------------------------------------- | -------------- |
| Badges, tags, small chips                       | `rounded-md`   |
| Buttons, inputs, selects, nav items, menu items | `rounded-lg`   |
| Cards, dropdowns, popovers, modals, toasts      | `rounded-xl`   |
| Avatars, status dots, pill toggles              | `rounded-full` |

## Typography (Geist)

| Role                                              | Classes                                                          |
| ------------------------------------------------- | ---------------------------------------------------------------- |
| Page heading                                      | `text-xl font-semibold tracking-tight text-ink`                  |
| Top bar title                                     | `text-base font-semibold tracking-tight text-white`              |
| Card / section title                              | `text-sm font-semibold text-ink`                                 |
| Body                                              | `text-sm text-ink`                                               |
| Secondary text                                    | `text-sm text-muted`                                             |
| Form label                                        | `text-sm font-medium text-ink`                                   |
| Group label (sidebar, small section headers only) | `text-[11px] font-medium uppercase tracking-wider text-muted/70` |
| Numbers / KPIs                                    | `text-2xl font-semibold tracking-tight text-ink tabular-nums`    |

## Spacing & layout

- Page content: `p-6` (mobile `p-4`), max width where text-heavy: `max-w-5xl`.
- Card padding: `p-5`; between cards: `gap-4`; between page sections: `space-y-6`.
- Control heights: `h-9` default, `h-10` in forms, `h-8` compact (tables, toolbars).

## Icons

lucide-react, `strokeWidth={1.75}`. Sizes: `h-4 w-4` in buttons/menus, `h-[18px] w-[18px]` in nav, `h-5 w-5` standalone. Color follows the text (`text-muted` when idle).

## Motion

`transition-colors` / `transition-opacity` / `transition-transform`, `duration-200`. Only animate color, opacity and transform. Respect `motion-reduce:`.

## Shared components (use these, don't hand-roll)

- `Button` (`components/ui/button.tsx`): variants `primary` (solid brand color), `secondary`, `ghost`, `danger`; sizes `sm` / `md` / `lg`; `icon`, `loading`, `href`.
- `PageHeader` (`components/layout/pageHeader.tsx`): top of every page. `title`, `description`, optional `icon` (gradient tile), `actions` (buttons, right side).
- `SubPageHeader`: same, with a back button that uses `router.back()` (falls back to `fallbackHref` when there's no history; `onBack` overrides it). Use on detail and nested pages.

## Component recipes

**Card**
`rounded-xl border border-line bg-white p-5`

**Primary button**
`inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-white shadow-sm transition hover:bg-primary-hover disabled:opacity-50 disabled:pointer-events-none`

**Secondary button**
`inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-line bg-white px-4 text-sm font-medium text-ink transition-colors hover:bg-surface`

**Ghost button**
`inline-flex h-9 items-center justify-center gap-2 rounded-lg px-3 text-sm font-medium text-muted transition-colors hover:bg-surface hover:text-ink`

**Danger button**
`inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-danger px-4 text-sm font-medium text-white transition hover:brightness-110`

**Input / select / textarea**
`h-10 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink placeholder:text-muted/60 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10`
Error state: `border-danger focus:border-danger focus:ring-danger/10` + `text-xs text-danger` message below.

**Badge**
`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium`
Variants: `bg-success/10 text-success`, `bg-warning/15 text-[#8a5d00]`, `bg-danger/10 text-danger`, `bg-primary-soft text-primary`, neutral `bg-surface text-muted`.

**Table**
Wrapper: card without padding (`overflow-hidden`).
Header row: `bg-surface text-xs font-medium text-muted` (normal case), cells `px-4 py-2.5 text-left`.
Body rows: `border-t border-line text-sm text-ink hover:bg-surface/60`, cells `px-4 py-3`.

**Dropdown / popover**
`rounded-xl border border-line bg-white p-1.5 shadow-lg`; items `rounded-lg px-3 py-2 text-sm text-ink hover:bg-surface`.

**Modal**
Overlay `bg-ink/40`; panel `w-full max-w-lg rounded-xl border border-line bg-white shadow-xl`; header `px-6 pt-6`, body `px-6 py-4`, footer `flex justify-end gap-2 border-t border-line px-6 py-4`.

**Nav item** (sidebar)
Idle `rounded-lg px-3 py-2 text-sm text-muted hover:bg-surface hover:text-ink`; active `bg-primary-soft font-medium text-ink`, icon `text-primary`, plus 3px `bg-brand-vertical` bar on the left.

**Selectable list item** (pickers, selectors)
Idle `rounded-xl border border-line bg-white p-3 hover:border-primary/30 hover:bg-surface`, icon tile `h-10 w-10 rounded-lg bg-surface text-muted`.
Selected `border-primary/40 bg-primary-soft`, icon tile `bg-brand text-white`, check badge `h-5 w-5 rounded-full bg-brand` with white `Check`. Use `aria-pressed`.

**Search input**
Input recipe with `pl-9`, `type="search"`, and a `Search` icon `absolute left-3 h-4 w-4 text-muted pointer-events-none`.

**Empty state**
Centered in the card: icon in `h-10 w-10 rounded-xl bg-primary-soft text-primary`, title `text-sm font-semibold text-ink`, text `text-sm text-muted`, optional primary button.

**Focus**
Every interactive element keeps a visible focus style: inputs use the ring above; buttons and links `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary`.
