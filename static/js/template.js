//////////////////////////////////////////////////////////////
/*
  Global Constants & Configuration
*/
const cursors = [
  "agent3",
  "agent4",
  "agent8",
  "bigman",
  "callie",
  "captain",
  "hime",
  "inkling",
  "judd",
  "lijudd",
  "marie",
  "marina",
  "shiver",
];

const cursor_to_color = {
  agent3: "6EF9AF",
  agent4: "FFDF2C",
  agent8: "FA017E",
  bigman: "4D4C56",
  callie: "ED55B3",
  captain: "AD9B1D",
  hime: "FCE9C6",
  inkling: "17B916",
  judd: "D80C4B",
  lijudd: "68FF53",
  marie: "D7E6E4",
  marina: "420D3D",
  shiver: "3D43CE",
};

const cursor_to_color_hsl = {
  agent3: { h: 160, s: 100, l: 50 },
  agent4: { h: 50, s: 100, l: 50 },
  agent8: { h: 320, s: 100, l: 50 },
  bigman: { h: 240, s: 0, l: 33 },
  callie: { h: 320, s: 100, l: 50 },
  captain: { h: 50, s: 100, l: 50 },
  hime: { h: 23, s: 84, l: 93 },
  inkling: { h: 120, s: 100, l: 50 },
  judd: { h: 320, s: 100, l: 50 },
  lijudd: { h: 120, s: 100, l: 50 },
  marie: { h: 180, s: 0, l: 90 },
  marina: { h: 306, s: 67, l: 15 },
  shiver: { h: 240, s: 100, l: 50 },
};

// Global ink state
window.r = 0;
window.g = 0;
window.b = 0;
window.h = 0;
window.s = 0;
window.l = 0;
window.base_h = 282;
window.base_s = 77;
window.base_l = 50;

const cursor_template = ({ name }) => `
<li id="li-${name}" class="cursor-option">
    <img src="static/images/cursors/${name}-pack.png" alt="${name}" height="40">
</li>`;

// Selectors that should show custom pointer on hover (all pages)
const POINTER_SELECTORS =
  'a, button, .cursor-option, #cursor-container li, [role="button"], .record-clickable, .record-modal-backdrop, .record-modal-close, #about-btn, .about-modal-backdrop, .about-modal-close';

//////////////////////////////////////////////////////////////
/*
  Initialization Logic
*/
window.addEventListener("load", () => {
  const currentCursorName = sessionStorage.getItem("cursor_name") || "hime";

  // Set defaults if not present
  if (!sessionStorage.getItem("cursor_name")) {
    sessionStorage.setItem("cursor_name", "hime");
    sessionStorage.setItem(
      "cursor",
      "url(static/images/cursors/hime-cursor.png), auto",
    );
    sessionStorage.setItem(
      "pointer",
      "url(static/images/cursors/hime-pointer.png), auto",
    );
    sessionStorage.setItem("ink_color", "FCE9C6");
    sessionStorage.setItem(
      "ink_color_hsl",
      JSON.stringify(cursor_to_color_hsl["hime"]),
    );
  }

  // Update ink colors from storage
  const ink_color = sessionStorage.getItem("ink_color");
  window.r = parseInt(ink_color.substring(0, 2), 16);
  window.g = parseInt(ink_color.substring(2, 4), 16);
  window.b = parseInt(ink_color.substring(4, 6), 16);
  const ink_color_hsl = JSON.parse(sessionStorage.getItem("ink_color_hsl"));
  window.h = ink_color_hsl.h;
  window.s = ink_color_hsl.s;
  window.l = ink_color_hsl.l;

  // Apply cursor style
  document.documentElement.style.cursor = sessionStorage.getItem("cursor");

  // Dynamic style: use custom pointer on all clickable/hover elements
  const styleId = "dynamic-cursor-style";
  let styleEl = document.getElementById(styleId);
  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = styleId;
    document.head.appendChild(styleEl);
  }
  styleEl.innerHTML = `
    ${POINTER_SELECTORS} { 
      cursor: ${sessionStorage.getItem("pointer")} !important; 
    }
  `;

  const cursorBtnImg = document.querySelector("#cursor-btn img");
  if (cursorBtnImg) {
    cursorBtnImg.src = `static/images/cursors/${sessionStorage.getItem("cursor_name")}-pointer.png`;
  }

  // Populate cursor list
  const cursorContainer = document.getElementById("cursor-container");
  if (cursorContainer) {
    cursorContainer.innerHTML = ""; // Clear existing
    cursors.forEach((name) => {
      const html = cursor_template({ name });
      cursorContainer.insertAdjacentHTML("beforeend", html);

      // Bind click event to each option
      document.getElementById(`li-${name}`).addEventListener("click", () => {
        const cursorPath = `static/images/cursors/${name}-cursor.png`;
        const pointerPath = `static/images/cursors/${name}-pointer.png`;
        const cursorUrl = `url(${cursorPath}), auto`;
        const pointerUrl = `url(${pointerPath}), auto`;

        sessionStorage.setItem("cursor", cursorUrl);
        sessionStorage.setItem("pointer", pointerUrl);
        sessionStorage.setItem("cursor_name", name);
        sessionStorage.setItem("ink_color", cursor_to_color[name]);
        sessionStorage.setItem(
          "ink_color_hsl",
          JSON.stringify(cursor_to_color_hsl[name]),
        );

        // Immediate application
        document.documentElement.style.cursor = cursorUrl;
        const styleEl = document.getElementById("dynamic-cursor-style");
        if (styleEl) {
          styleEl.innerHTML = `
            ${POINTER_SELECTORS} { 
              cursor: ${pointerUrl} !important; 
            }
          `;
        }
        if (cursorBtnImg) cursorBtnImg.src = pointerPath;

        // Update global ink colors
        window.r = parseInt(cursor_to_color[name].substring(0, 2), 16);
        window.g = parseInt(cursor_to_color[name].substring(2, 4), 16);
        window.b = parseInt(cursor_to_color[name].substring(4, 6), 16);
        window.h = cursor_to_color_hsl[name].h;
        window.s = cursor_to_color_hsl[name].s;
        window.l = cursor_to_color_hsl[name].l;

        // Visual feedback: briefly hide and show container to force redraw on some mobile browsers
        cursorContainer.style.display = "none";
        setTimeout(() => {
          cursorContainer.style.display = "flex";
        }, 50);
      });
    });
  }
});

/*
  Back to Top Button Logic
*/
const backToTopBtn = document.getElementById("back-to-top");
window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    backToTopBtn.classList.add("visible");
  } else {
    backToTopBtn.classList.remove("visible");
  }
});

backToTopBtn.addEventListener("click", (e) => {
  e.preventDefault();
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

//////////////////////////////////////////////////////////////
/*
  Cursor Box Toggle
*/
function positionCursorBox() {
  const cursorBox = document.getElementById("cursor-box");
  const cursorBtn = document.getElementById("cursor-btn");
  const topNav = document.querySelector(".top-nav");
  if (
    cursorBox &&
    cursorBox.classList.contains("option-box-visible") &&
    cursorBtn
  ) {
    const navHeight = topNav ? topNav.offsetHeight : 60;
    const btnRect = cursorBtn.getBoundingClientRect();
    cursorBox.style.top = `${navHeight + 10}px`;
    cursorBox.style.left = `${btnRect.left + btnRect.width - cursorBox.offsetWidth}px`;
  }
}

const cursorBtn = document.getElementById("cursor-btn");
if (cursorBtn) {
  cursorBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    const cursorBox = document.getElementById("cursor-box");
    if (cursorBox) {
      cursorBox.classList.toggle("option-box-visible");
      positionCursorBox();
    }
  });
}

window.addEventListener("resize", positionCursorBox);
document.addEventListener("click", (event) => {
  const cursorBox = document.getElementById("cursor-box");
  const cursorBtn = document.getElementById("cursor-btn");
  if (
    cursorBox &&
    cursorBtn &&
    !cursorBox.contains(event.target) &&
    !cursorBtn.contains(event.target)
  ) {
    cursorBox.classList.remove("option-box-visible");
  }
});

//////////////////////////////////////////////////////////////
/*
  About Modal
*/
const aboutBtn = document.getElementById("about-btn");
const aboutModal = document.getElementById("about-modal");
const aboutBackdrop =
  aboutModal && aboutModal.querySelector(".about-modal-backdrop");
const aboutCloseBtn =
  aboutModal && aboutModal.querySelector(".about-modal-close");

function closeAboutModal() {
  if (!aboutModal) return;
  aboutModal.classList.remove("about-modal-open");
  aboutModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

if (aboutBtn) {
  aboutBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (aboutModal) {
      aboutModal.classList.add("about-modal-open");
      aboutModal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }
  });
}
if (aboutBackdrop) aboutBackdrop.addEventListener("click", closeAboutModal);
if (aboutCloseBtn) aboutCloseBtn.addEventListener("click", closeAboutModal);
document.addEventListener("keydown", (e) => {
  if (
    e.key === "Escape" &&
    aboutModal &&
    aboutModal.classList.contains("about-modal-open")
  )
    closeAboutModal();
});

//////////////////////////////////////////////////////////////
/*
  Cursor Effect Logic (Ink & Splat)
*/
let cursor_effect = sessionStorage.getItem("cursor_effect") === "true";

const effectBtn = document.getElementById("cursor_effect_btn");
if (effectBtn) {
  // Initialize button visibility based on stored state
  const onImg = document.getElementById("cursor_effect_on");
  const offImg = document.getElementById("cursor_effect_off");
  if (onImg) onImg.style.display = cursor_effect ? "inline" : "none";
  if (offImg) offImg.style.display = cursor_effect ? "none" : "inline";

  effectBtn.addEventListener("click", () => {
    cursor_effect = !cursor_effect;
    sessionStorage.setItem("cursor_effect", cursor_effect);
    if (onImg) onImg.style.display = cursor_effect ? "inline" : "none";
    if (offImg) offImg.style.display = cursor_effect ? "none" : "inline";
  });
}

const container = document.getElementById("main-container");
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
function getRandomColor() {
  const r = Math.min(255, Math.max(0, window.r + getRandomInt(-15, 15)));
  const g = Math.min(255, Math.max(0, window.g + getRandomInt(-15, 15)));
  const b = Math.min(255, Math.max(0, window.b + getRandomInt(-15, 15)));
  return `rgb(${r},${g},${b})`;
}

if (container) {
  container.addEventListener("mousemove", (e) => {
    if (cursor_effect) {
      const rect = container.getBoundingClientRect();
      const point = document.createElement("div");
      point.className = "cursor-point";
      point.style.left = `${e.clientX - rect.left}px`;
      point.style.top = `${e.clientY - rect.top}px`;
      point.style.backgroundColor = getRandomColor();
      const size = Math.random() * 15 + 5;
      point.style.width = `${size}px`;
      point.style.height = `${size}px`;
      const rotation = Math.random() * 360;
      point.style.transform = `rotate(${rotation}deg)`;
      container.appendChild(point);

      setTimeout(() => {
        point.style.opacity = 0;
        point.style.transform = `scale(0) rotate(${rotation}deg)`;
        setTimeout(() => point.remove(), 1000);
      }, 50);
    }
  });

  const splat_template = ({ id, height }) =>
    `<img src="static/images/splats/${id}.svg" height="${height}">`;

  let clickTimer = null;
  container.addEventListener("click", (e) => {
    if (cursor_effect) {
      if (e.detail === 1) {
        // Delay the splat to check if it's a double click
        const clickX = e.clientX;
        const clickY = e.clientY;
        clickTimer = setTimeout(() => {
          const rect = container.getBoundingClientRect();
          const splat = document.createElement("div");
          splat.className = "dynamic-svg";
          const height = Math.floor(Math.random() * 70) + 80;
          splat.style.left = `${clickX - rect.left - height / 2}px`;
          splat.style.top = `${clickY - rect.top - height / 2}px`;

          const imageId = Math.floor(Math.random() * 18) + 1;
          splat.innerHTML = splat_template({
            id: "splat" + imageId,
            height: height,
          });
          container.appendChild(splat);

          const h_filter = window.h - window.base_h;
          const s_filter = (window.s / window.base_s) * 100;
          const l_filter = (window.l / window.base_l) * 100;
          let opa = 0.9;
          const cName = sessionStorage.getItem("cursor_name");
          if (["hime", "agent3", "agent4"].includes(cName)) opa = 0.3;
          else if (cName === "marie") opa = 0.4;

          splat.style.filter = `hue-rotate(${h_filter}deg) saturate(${s_filter}%) brightness(${l_filter}%) opacity(${opa})`;

          splat.animate(
            [
              { transform: "scale(0)", opacity: 1 },
              { transform: "scale(1)", opacity: 1 },
            ],
            { duration: 100, fill: "forwards" },
          );
          setTimeout(() => {
            splat.style.opacity = "0";
            setTimeout(() => splat.remove(), 500);
          }, 1000);
          clickTimer = null;
        }, 200); // 200ms window for double click detection
      } else {
        // If second click happens, cancel the pending splat
        clearTimeout(clickTimer);
        clickTimer = null;
      }
    }
  });
}
