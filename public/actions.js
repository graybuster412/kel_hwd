// const BASE_URL = window.location.href.includes("kelxtamara-wedding")
//   ? "https://kelbe-graybuster412s-projects.vercel.app/api/"
//   : "https://kelbe-git-dev-graybuster412s-projects.vercel.app/api/";
const BASE_URL = "https://kelbe-graybuster412s-projects.vercel.app/api/";

var wishes = window?.initialWishes ?? [];

function showToast(msg, type = "success") {
  const toastHost = document.getElementById("toastHost");
  if (!toastHost) return alert(msg);
  const host = document.getElementById("toastHost");
  const t = document.createElement("div");
  t.className = "toast" + (type === "error" ? " error" : "");
  t.textContent = msg;
  host.appendChild(t);
  // Slide up gently when multiple toasts appear
  const offset = (host.children.length - 1) * 12;
  t.style.marginTop = offset + "px";
  setTimeout(() => t.remove(), 4200);
}

// Render a single wish card element
function renderWishCard({ name, message, createdAt }) {
  const safe = (s) => (s || "").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const wrap = document.createElement("article");
  wrap.className = "wish-card added";
  wrap.innerHTML = `
      <div class="wish-card-head">
        <span class="wish-name">${safe(name || "Khách")}</span>
        <time class="wish-time" datetime="${createdAt || ""}">
          ${fmtTime(createdAt)}
        </time>
      </div>
      <p class="wish-msg">${safe(message)}</p>
    `;
  return wrap;
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

document.addEventListener("DOMContentLoaded", function () {
  const urlWish = BASE_URL + "addWish";
  const urlRsvp = BASE_URL + "rsvp";

  async function postData(data, url) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok)
        throw new Error(`Lỗi HTTP: ${res.status}, error: ${res.body}`);
      return await res.json();
    } catch (err) {
      console.error("❌ Gửi thất bại:", err);
      throw new Error(err);
    }
  }

  // GỬI LỜI CHÚC
  document
    .getElementById("WISH_SUBMIT_BUTTON")
    ?.addEventListener("click", async (e) => {
      try {
        const name =
          document.querySelector("#WISH_NAME_INPUT input")?.value.trim() || "";
        const relationship =
          document.querySelector("#WISH_RELATION_SELECT select")?.value || "";
        const message =
          document
            .querySelector("#WISH_MESSAGE_TEXTAREA textarea")
            ?.value.trim() || "";
        const predefined =
          document.querySelector("#WISH_PREDEFINED_SELECT select")?.value || "";
        const form = document.querySelector("#FORM2 form, #FORM2");

        if (!name) return showToast("Vui lòng nhập tên.", "error");
        if (!relationship)
          return showToast("Vui lòng chọn mối quan hệ.", "error");
        if (!message && !predefined)
          return showToast("Vui lòng nhập hoặc chọn lời chúc.", "error");

        const combinedMessage =
          message && predefined
            ? `${message} / ${predefined}`
            : message || predefined;

        const data = {
          fullname: name,
          relationship,
          wish_msg: combinedMessage,
          predefined_wish: predefined,
        };

        const result = await postData(data, urlWish);
        // const result = true;

        if (!result) {
          showToast("Có lỗi xảy ra. Thử lại sau nhé.", "error");
        } else {
          // send successfully
          // Optimistic insert at top of list
          const host = document.getElementById("wishList");
          const card = renderWishCard({
            name: `${name} - ${relationship}`,
            message: combinedMessage,
            createdAt: new Date().toISOString(),
          });
          document?.getElementById("empty-wish")?.remove(); // remove empty wish card box
          if (host) {
            host.prepend(card);
            // keep the list scrolled to top to show the new card
            host.scrollTo({ top: 0, behavior: "smooth" });
          }
          form?.reset();
          showToast(`Vợ chồng xin cảm ơn tình cảm của ${name} 💖 rất nhiều!`);
        }
      } catch (e) {
        console.error("error", e.toString());
        showToast("Có lỗi xảy ra. Thử lại sau nhé.", "error");
      }
    });

  // GỬI XÁC NHẬN THAM DỰ
  document
    .getElementById("RSVP_SUBMIT_BUTTON")
    ?.addEventListener("click", async (e) => {
      try {
        const form = document.querySelector("#FORM15 form, #FORM15");
        const name =
          document.querySelector("#RSVP_NAME_INPUT input")?.value.trim() || "";
        const isAttending = document.querySelector(
          '#RSVP_ATTENDING_RADIO input[type="radio"]:checked'
        )?.value;
        const party =
          document.querySelector("#RSVP_PARTY_SELECT select")?.value || "";
        const guestCount =
          document.querySelector("#RSVP_GUEST_COUNT_SELECT select")?.value ||
          "";
        const message =
          document
            .querySelector("#RSVP_MESSAGE_TEXTAREA textarea")
            ?.value.trim() || "";

        if (!name) return showToast("Vui lòng nhập tên.", "error");
        if (!isAttending)
          return showToast("Vui lòng chọn tham dự hay không.", "error");
        if (isAttending !== "Xin lỗi, tôi bận mất rồi" && !party)
          return showToast("Vui lòng chọn tiệc muốn tham dự.", "error");
        if (isAttending !== "Xin lỗi, tôi bận mất rồi" && !guestCount)
          return showToast("Vui lòng chọn số lượng khách.", "error");

        const data = {
          fullname: name,
          email: name,
          status: isAttending,
          guests: guestCount,
          place: party,
          message,
        };

        const result = await postData(data, urlRsvp);
        if (result) {
          // successfully
          form?.reset();
          showToast(`Cảm ơn ${name} 💖 đã phản hồi cho vợ chồng mình nha.`);
        }
      } catch (e) {
        showToast("Có lỗi xảy ra. Thử lại sau nhé.", "error");
      }
    });
});

(function () {
  async function fetchWishes() {
    try {
      const res = await fetch(BASE_URL + "getWishes", { method: "GET" });
      if (!res.ok) throw new Error("Failed to fetch wishes");
      const payload = await res.json();
      const wishes = payload?.wishes ?? [];
      // Normalize to {name, message, createdAt}
      return wishes.map((r) => ({
        name: `${(r.Fullname || "Khách")} - ${r.Relationship || ""}`,
        message: r.WishMessage || "",
        createdAt:
          r.CreatedAt || r.fields?.createdAt || new Date().toISOString(),
      }));
    } catch (e) {
      console.warn("Wishes load error:", e);
      return wishes;
    }
  }

  function renderWishes(list) {
    const host = document.getElementById("wishList");
    if (!host) return;
    if (!list?.length) {
      host.innerHTML = `
            <article id="empty-wish" class="wish-card">
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
    if (data?.length) {
      wishes = wishes.concat([...data]);
    }
    renderWishes(wishes);
  }

  document
    .getElementById("wishRefreshBtn")
    ?.addEventListener("click", loadAndRender);
  // Initial load
  loadAndRender();
})();
