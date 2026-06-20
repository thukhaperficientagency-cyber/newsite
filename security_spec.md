# Security Specifications for Agency Web Application

## 1. Data Invariants
- `settings`: Global parameters can only be read by anyone, but written/updated exclusively by the validated Admin (`thukhaaung542981@gmail.com`).
- `team`: Team profiles are public-read. Creation, editing, or deletion is restricted strictly to the validated Admin.
- `portfolio`: Project showcases are public-read. Changes are restricted strictly to the validated Admin.
- `blog`: Blog posts are public-read for published posts. Draft and published posts can be read or fully managed by the Admin.

## 2. Dirty Dozen Payloads (Targeting Firestore Rules)
Below are 12 specific payloads or operations designed to breach access controls:
1. **Unauthenticated Site Edit**: An anonymous attacker tries to write to `/settings/config` to change the logo or redirect contacts to a malicious page.
2. **Admin Impersonation**: A random authenticated user attempts to modify site config or publish spam articles.
3. **Draft Discovery**: An unauthenticated consumer attempts to list or access draft blog articles before launch.
4. **ID Poisoning in Portfolio**: A user tries to create a portfolio item with a 10KB junk-character string as ID.
5. **Junk Field Pollution**: Update portfolio with extra custom parameters (`{ title: "Project", sql_injection: "DROP TABLE users;" }`).
6. **Self-Elevated Author field**: User creates a blog post and lists another author name/avatar without permission.
7. **Invalid Type Injection**: Putting boolean values instead of proper string description inside `Settings`.
8. **Negative Ordering Injection**: Assigning order `-99999` on team members to mess up visual list layout.
9. **Spam Article Flood**: Attacking with thousands of small, useless blog posts to exceed Firestore limits.
10. **Timestamp Spoofing**: Supplying a historic or future date in `publishedAt` to falsify blog timeline.
11. **Malicious Path Injection**: Injecting path-traversal or special characters like `.` or `/` into IDs.
12. **Blanket Query Scraping**: Fetching the entire database bypassing proper query constraints.

## 3. Rules Implementation Plan
We create high-security rules that validate types, sizes, exact keys, and require Google verified email equal to the Bootstrap Admin.
