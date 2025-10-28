const BASE_URL = "https://kelbe-graybuster412s-projects.vercel.app/api/";

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
      if (!res.ok) throw new Error(`Lỗi HTTP: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error("❌ Gửi thất bại:", err);
      alert("Có lỗi xảy ra. Vui lòng thử lại sau.");
    }
  }

  // GỬI LỜI CHÚC
  document
    .getElementById("WISH_SUBMIT_BUTTON")
    ?.addEventListener("click", async (e) => {
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

      if (!name) return alert("Vui lòng nhập tên.");
      if (!relationship) return alert("Vui lòng chọn mối quan hệ.");
      if (!message && !predefined)
        return alert("Vui lòng nhập hoặc chọn lời chúc.");

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

      await postData(data, urlWish);
      // if (result) {
      // };
    });

  // GỬI XÁC NHẬN THAM DỰ
  document
    .getElementById("RSVP_SUBMIT_BUTTON")
    ?.addEventListener("click", async (e) => {
      const name =
        document.querySelector("#RSVP_NAME_INPUT input")?.value.trim() || "";
      const isAttending = document.querySelector(
        '#RSVP_ATTENDING_RADIO input[type="radio"]:checked'
      )?.value;
      const party =
        document.querySelector("#RSVP_PARTY_SELECT select")?.value || "";
      const guestCount =
        document.querySelector("#RSVP_GUEST_COUNT_SELECT select")?.value || "";
      const message =
        document
          .querySelector("#RSVP_MESSAGE_TEXTAREA textarea")
          ?.value.trim() || "";
      const attendingStatus = (statusMsg) => {
        return statusMsg === "Xin lỗi, tôi bận mất rồi" ? "no" : "yes";
      };

      if (!name) return alert("Vui lòng nhập tên.");
      if (!isAttending) return alert("Vui lòng chọn tham dự hay không.");
      if (isAttending !== "Xin lỗi, tôi bận mất rồi" && !party)
        return alert("Vui lòng chọn tiệc muốn tham dự.");
      if (isAttending !== "Xin lỗi, tôi bận mất rồi" && !guestCount)
        return alert("Vui lòng chọn số lượng khách.");

      const data = {
        fullname: name,
        email: "",
        status: attendingStatus(isAttending),
        guests: guestCount,
        place: party,
        message,
      };

      const result = await postData(data, urlRsvp);
      if (result) {
      }
    });
});
