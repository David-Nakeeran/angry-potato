// dom elements
const resetBtn = document.getElementById("reset");
const totalCookiesDisplay = document.getElementById("total-cookies");
const incrementCookieBtn = document.getElementById("cookie-increment-btn");
const cookiesPerSec = document.getElementById("cps");
const upgradesWrapper = document.getElementById("upgrades-wrapper");
const announcements = document.getElementById("announcements");
const showCookieUpgrades = document.getElementById("cookie-upgrades-btn");
const upgrade = document.getElementById("upgrade");
const upgradeContainer = document.getElementById("upgrades-container");
const audioBtn = document.getElementById("audio");
const audioOn = document.getElementById("audio-on");
const audioPop = document.getElementById("audio-pop");

const i = document.createElement("i");
i.classList = "fa-solid fa-volume-xmark";

// Get data from local storage, if null create cookiedata object
let cookieData = JSON.parse(localStorage.getItem("cookieGameData")) || {
  totalCookies: 0,
  cookieClickValue: 1,
  cookiesPerSec: 1,
  audioOn: true,
};

// Save game state
const saveGameState = () => {
  localStorage.setItem("cookieGameData", JSON.stringify(cookieData));
};

// Callbacks
// Callback for setInterval
const incrementTotalCookies = () => {
  cookieData.totalCookies += cookieData.cookiesPerSec;
  totalCookiesDisplay.textContent = `Total Cookies: ${cookieData.totalCookies}`;
  displayCookiesPerSec();
  saveGameState();
};

// Callback for incrementBtn event listener
const incrementBtnHandler = () => {
  cookieData.totalCookies += cookieData.cookieClickValue;
  saveGameState();
  totalCookiesDisplay.textContent = `Total Cookies: ${cookieData.totalCookies}`;

  // Put into audio function
  if (cookieData.audioOn) {
    console.log(cookieData.audioOn);
    audioPop.currentTime = 0;
    audioPop.play();
  }
};

// Callback for resetBtn event listener
const resetBtnHandler = () => {
  localStorage.clear();
  cookieData = {
    totalCookies: 0,
    cookieClickValue: 1,
    cookiesPerSec: 1,
  };
  announcements.textContent = "";
};

// Callback show upgrades list
const showUpgrades = () => {
  upgradeContainer.classList.toggle("hidden");
};

// Callback handle audio
const audioHandler = () => {
  if (audioOn.parentElement === audioBtn) {
    audioBtn.removeChild(audioOn);
    audioBtn.appendChild(i);
    cookieData.audioOn = false;
    saveGameState();
  } else {
    audioBtn.removeChild(i);
    audioBtn.appendChild(audioOn);
    cookieData.audioOn = true;
    saveGameState();
  }
};

// Set Interval
setInterval(incrementTotalCookies, 1000);

// Display cookies per second
const displayCookiesPerSec = () => {
  cookiesPerSec.textContent = `Cookies Per Sec: ${cookieData.cookiesPerSec}`;
};

// Fetch data from API
const getData = async () => {
  const url = "https://cookie-upgrade-api.vercel.app/api/upgrades";
  try {
    const response = await fetch(url);
    return response.json();
  } catch (error) {
    console.error(error.message);
  }
};
const upgrades = await getData();

// Loop through fetched data, create upgrade elements
upgrades.forEach((element, index) => {
  const div = document.createElement("div");
  div.setAttribute("class", "upgrade");
  div.setAttribute("id", "upgrade");
  upgradeContainer.appendChild(div);
  const namePara = document.createElement("p");
  const costPara = document.createElement("p");
  const cookieValueUpgrade = document.createElement("p");
  const buyBtn = document.createElement("button");

  buyBtn.setAttribute("data-index", index);
  buyBtn.classList.add("buy-btn");
  div.setAttribute("id", element.id);

  namePara.textContent = `${element.name}`;
  costPara.textContent = `Cost ${element.cost} Cookies`;
  cookieValueUpgrade.textContent = `Increases CPS by ${element.increase}`;
  buyBtn.textContent = "Buy upgrade";

  div.append(namePara, costPara, cookieValueUpgrade, buyBtn);
});

const buyUpgrade = () => {
  const buyBtns = document.querySelectorAll("[data-index]");
  buyBtns.forEach((element) => {
    element.addEventListener("click", (e) => {
      const { name, cost, increase } = upgrades[element.dataset.index];
      if (cookieData.totalCookies < cost) {
        announcements.textContent =
          "You do not have enough cookies, to buy this upgrade....work harder!";
      } else {
        announcements.textContent = `You have activated ${name}`;
        cookieData.totalCookies -= cost;
        cookieData.cookieClickValue += increase;
        cookieData.cookiesPerSec += increase;
        saveGameState();
      }
    });
  });
};
buyUpgrade();

// Event listeners
audioBtn.addEventListener("click", audioHandler);
incrementCookieBtn.addEventListener("click", incrementBtnHandler);
resetBtn.addEventListener("click", resetBtnHandler);
showCookieUpgrades.addEventListener("click", showUpgrades);
