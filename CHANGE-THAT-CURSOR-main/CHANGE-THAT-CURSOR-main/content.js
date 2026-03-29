const apply = () => {
  const el = document.getElementById("cc-style");
  if (el) el.remove();

  chrome.storage.local.get("customCursor", (data) => {
    if (data.customCursor) {
      const s = document.createElement("style");
      s.id = "cc-style";
      s.innerHTML = `* { cursor: url('${data.customCursor}') 16 16, auto !important; }`;
      document.documentElement.appendChild(s);
    }
  });
};

apply();
chrome.storage.onChanged.addListener(apply);
