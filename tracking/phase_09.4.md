Act as a UI Engineer. We need to "Polishing Phase" for the Availability Grid.

**Context:**
The grid is currently rendering raw text numbers. It needs to be a Heatmap.
We also need to fix the alignment and spacing.

**Directive:**
Refactor `libs/team-manager/src/lib/components/availability-grid/availability-grid.tsx` (and `availability-cell.tsx` if separated).

**Task 1: Implement Visual Logic (The Heatmap)**
Update the Cell rendering to use a wrapper `div` with conditional Tailwind classes:

- **Logic:**
  - `hours == 0`: `bg-gray-50 text-gray-300` (Empty)
  - `hours > 0 && hours <= 6`: `bg-emerald-100 text-emerald-800` (Healthy)
  - `hours > 6 && hours <= 9`: `bg-yellow-100 text-yellow-800` (Busy)
  - `hours > 9`: `bg-red-100 text-red-800 font-bold` (Overloaded)
- **Styling:**
  - Add `rounded-md`, `w-full`, `h-full`, `flex`, `items-center`, `justify-center`.
  - Add a small transition `transition-colors duration-200`.

**Task 2: Improve Grid Layout**

- **Header Row:**
  - Center align the dates.
  - Add `text-xs uppercase text-gray-500` for styling.
- **Body Rows:**
  - Add `border-b border-gray-100` between rows for readability.
  - Ensure the "Member" column (Name/Avatar) is sticky or distinct from the data columns.
  - Add some vertical padding (`py-3`) to let the data breathe.

**Task 3: (Optional) Handle "Impossible" Data**

- If `hours > 24`, render the number as "24+" and force the Red "Overloaded" style to prevent layout breakage.
