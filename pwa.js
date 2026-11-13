(() => {
  if (!("serviceWorker" in navigator)) return;
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch((error) => {
      console.error("BookNest offline support could not start:", error);
    });
  });
})();
