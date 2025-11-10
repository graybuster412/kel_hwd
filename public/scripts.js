window.addEventListener("load", function () {
  setTimeout(() => {
    document.body.classList.add("open");
  }, 300);
});

window.dataLayer = window.dataLayer || [];

function gtag() {
  dataLayer.push(arguments);
}
gtag("js", new Date());

gtag("config", "G-4ZDD2059S0");

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
