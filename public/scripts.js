window.addEventListener("load", function () {
  setTimeout(() => {
    document.body.classList.add("open");
  }, 300);
});

window.onload = function () {
  // on first load
  const audio = document.getElementById("background-music");
  const toggleButton = document.getElementById("music-toggle");
  const playIcon = document.getElementById("play-icon");
  const pauseIcon = document.getElementById("pause-icon");

  let isPlaying = false;
  let hasStarted = false;

  const playAudio = () => {
    if (!hasStarted) {
      audio
        .play()
        .then(() => {
          isPlaying = true;
          hasStarted = true;
          playIcon.style.display = "none";
          pauseIcon.style.display = "block";
          toggleButton.classList.add("vibrating");
        })
        .catch((e) => {
          console.log("Lỗi phát nhạc: ", e);
        });
    }
  };

  // Chạm lần đầu để phát nhạc
  document.body.addEventListener(
    "click",
    function () {
      playAudio();
    },
    {
      once: true,
    }
  );

  // Bấm nút để bật/tắt nhạc
  toggleButton.addEventListener("click", function (event) {
    event.stopPropagation(); // không lan sự kiện click

    if (isPlaying) {
      audio.pause();
      isPlaying = false;
      playIcon.style.display = "block";
      pauseIcon.style.display = "none";
      toggleButton.classList.remove("vibrating");
    } else {
      audio.play().then(() => {
        isPlaying = true;
        playIcon.style.display = "none";
        pauseIcon.style.display = "block";
        toggleButton.classList.add("vibrating");
      });
    }
  });
};

(function () {
  // 1) Provide data:
  // Option A: sample data (remove if you use API)
  // window.initialWishes = [
  //   { name: "Minh Anh", message: "Chúc hai bạn trăm năm hạnh phúc!", createdAt: "2025-10-02T09:12:00+07:00" },
  //   { name: "Huy & Linh", message: "Yêu thương bền lâu, đong đầy tiếng cười!", createdAt: "2025-10-03T21:05:00+07:00" },
  // ];

  // Option B: fetch from your endpoint (Airtable, etc.)
  async function fetchWishes() {
    try {
      // Replace with your actual endpoint, e.g. /api/wishes (GET)
      const res = await fetch(
        "https://kelbe-graybuster412s-projects.vercel.app/api/" + "getWishes",
        { method: "GET" }
      );
      if (!res.ok) throw new Error("Failed to fetch wishes");
      const payload = await res.json();
      // Normalize to {name, message, createdAt}
      return (payload.records || payload).map((r) => ({
        name: r.name || r.fields?.name || "Khách",
        message: r.message || r.fields?.message || "",
        createdAt:
          r.createdAt || r.fields?.createdAt || new Date().toISOString(),
      }));
    } catch (e) {
      console.warn("Wishes load error:", e);
      return window.initialWishes || [];
    }
  }

  function fmtTime(iso) {
    try {
      const d = new Date(iso);
      // Friendly dd/mm HH:MM
      return d.toLocaleString("vi-VN", { hour12: false });
    } catch {
      return "";
    }
  }

  function renderWishes(list) {
    const host = document.getElementById("wishList");
    if (!host) return;
    if (!list?.length) {
      host.innerHTML = `
          <article class="wish-card">
            <div class="wish-card-head">
              <span class="wish-name">—</span>
              <time class="wish-time"></time>
            </div>
            <p class="wish-msg">Chưa có lời chúc nào. Hãy là người đầu tiên! 🥰</p>
          </article>`;
      return;
    }
    host.innerHTML = list
      .slice() // copy
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // newest first
      .map(
        (item) => `
          <article class="wish-card">
            <div class="wish-card-head">
              <span class="wish-name">${(item.name || "Khách").replace(
                /[<>&]/g,
                ""
              )}</span>
              <time class="wish-time" datetime="${item.createdAt}">${fmtTime(
          item.createdAt
        )}</time>
            </div>
            <p class="wish-msg">${(item.message || "")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")}</p>
          </article>
        `
      )
      .join("");
  }

  async function loadAndRender() {
    const data = await fetchWishes();
    renderWishes(data);
  }

  document
    .getElementById("wishRefreshBtn")
    ?.addEventListener("click", loadAndRender);
  // Initial load
  loadAndRender();
})();
