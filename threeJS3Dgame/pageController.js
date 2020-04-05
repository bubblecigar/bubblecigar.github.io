
navigator.serviceWorker.register('./sw.js').then(
  registration => {
    console.log('registration:', registration)
  }
)
