# Precision Ratchet Auto Repair — Phoenix, AZ

A demo marketing website for a fictional full-service auto repair shop in
Phoenix, Arizona. Built as a fast, dependency-free static site.

## Stack

- Plain **HTML / CSS / JavaScript** — no build step, no framework
- Google Fonts (Inter + Oswald)
- Responsive, mobile-first, dark "shop" aesthetic
- `AutoRepair` schema.org structured data + Open Graph tags

## Structure

```
index.html      # All page content
styles.css      # Styling + responsive rules
script.js       # Mobile nav, scroll reveals, demo booking form
vercel.json     # Static deploy config
```

## Run locally

It's a static site — just open `index.html`, or serve the folder:

```bash
# any static server works, e.g.
python -m http.server 5173
# then open http://localhost:5173
```

## Deploy

Hosted on **Vercel** as a static site. Pushes to `main` auto-deploy when the
repo is connected to a Vercel project.

> Demo only. Address, phone number, hours, and reviews are fictional.
