// Loads the dashboard card once the Home Assistant app has started.
//
// The frontend imports extra modules alongside its app bundle, and the app replaces
// window.customElements with a scoped custom element registry polyfill. Elements defined on the
// native registry before that swap are invisible to the polyfill's get(), so Lovelace shows a
// configuration error instead of the card. The app defines <home-assistant> after the swap.
await customElements.whenDefined("home-assistant");
// Same version query as this module, so a card update also refreshes the cached card.
const search = new URL(import.meta.url).search;
await import(new URL(`./logrono-bus-card.js${search}`, import.meta.url).href);
