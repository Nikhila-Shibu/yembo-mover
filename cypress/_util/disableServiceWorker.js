export default function disableServiceWorker(win) {
  // Disable Service Worker: https://glebbahmutov.com/blog/cypress-tips-and-tricks/#disable-serviceworker
  delete win.navigator.__proto__.serviceWorker;
}
