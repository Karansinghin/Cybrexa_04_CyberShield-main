# SECURITY.md — CyberShield

## Security Practices
- All data processing runs client-side — no real API keys or backend exposed
- News and IP data are simulated/static datasets for demo purposes — no live external API calls
- No user data stored, no cookies, no localStorage
- Input sanitized via textContent in all dynamic rendering
- Chart.js loaded from trusted CDN (jsdelivr) with SRI best practices recommended for production

*© 2026 Cybrexa Technologies*
