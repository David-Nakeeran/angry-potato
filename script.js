// dom elements
const resetBtn = document.getElementById("reset");
const totalPotatoesDisplay = document.getElementById("total-potatoes");
const incrementPotatoBtn = document.getElementById("potato-increment-btn");
const potatoesPerSec = document.getElementById("pps");
const upgradesWrapper = document.getElementById("upgrades-wrapper");
const announcements = document.getElementById("announcements");
const showPotatoUpgrades = document.getElementById("potato-upgrades-btn");
const upgrade = document.getElementById("upgrade");
const upgradeContainer = document.getElementById("upgrades-container");
const audioBtn = document.getElementById("audio");
const audioOn = document.getElementById("audio-on");
const audioPop = document.getElementById("audio-pop");
const potatoImg = document.getElementById("potato");

let timeoutId;
// Make annoucement disapear after set amount of time
// fix bug with audio icon

const i = document.createElement("i");
i.classList = "fa-solid fa-volume-xmark";

// Get data from local storage, if null create potatoData object
let potatoData = JSON.parse(localStorage.getItem("potatoGameData")) || {
  totalPotatoes: 0,
  potatoClickValue: 1,
  potatoesPerSec: 1,
  audioOn: true,
};

// Save game state
const saveGameState = () => {
  localStorage.setItem("potatoGameData", JSON.stringify(potatoData));
};

// play audio
const playAudio = () => {
  if (potatoData.audioOn) {
    console.log(potatoData.audioOn);
    audioPop.currentTime = 0;
    audioPop.play();
  }
};

// Callback for setInterval
const incrementTotalPotatoes = () => {
  potatoData.totalPotatoes += potatoData.potatoesPerSec;
  totalPotatoesDisplay.textContent = `Total Potatoes: ${potatoData.totalPotatoes}`;
  displayPotatoesPerSecond();
  saveGameState();
};

const changeImageDelay = () => {
  potatoImg.src = "./assets/images/suprised-potatoe.png";
  clearTimeout(timeoutId); // cancels previous time out, spamming button clicks doesn't mess up change the img src
  setTimeout(() => {
    potatoImg.src = "./assets/images/angry-potatoe.png";
  }, 400);
};

// Callback for incrementBtn event listener
const incrementBtnHandler = () => {
  potatoData.totalPotatoes += potatoData.potatoClickValue;
  saveGameState();
  totalPotatoesDisplay.textContent = `Total Cookies: ${potatoData.totalPotatoes}`;
  playAudio();
  changeImageDelay();
};

// Callback for resetBtn event listener
const resetBtnHandler = () => {
  localStorage.clear();
  potatoData = {
    totalPotatoes: 0,
    potatoClickValue: 1,
    potatoesPerSec: 1,
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
    potatoData.audioOn = false;
    saveGameState();
  } else {
    audioBtn.removeChild(i);
    audioBtn.appendChild(audioOn);
    potatoData.audioOn = true;
    saveGameState();
  }
};

// Set Interval
setInterval(incrementTotalPotatoes, 1000);

// Display potatoes per second
const displayPotatoesPerSecond = () => {
  potatoesPerSec.textContent = `Potatoes Per Sec: ${potatoData.potatoesPerSec}`;
};

// Fetch data from API
const getData = async () => {
  const url = "https://cookie-upgrade-api.vercel.app/api/upgrades";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`HTTP status code: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error(
      `Something went from with fetching data from the API: ${error.message}`
    );
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
  const PotatoValueUpgrade = document.createElement("p");
  const buyBtn = document.createElement("button");

  buyBtn.setAttribute("data-index", index);
  buyBtn.classList.add("buy-btn");
  div.setAttribute("id", element.id);

  namePara.textContent = `${element.name}`;
  costPara.textContent = `Cost ${element.cost} Potatoes`;
  PotatoValueUpgrade.textContent = `Increases PPS by ${element.increase}`;
  buyBtn.textContent = "Buy upgrade";

  div.append(namePara, costPara, PotatoValueUpgrade, buyBtn);
});

const buyUpgrade = () => {
  const buyBtns = document.querySelectorAll("[data-index]");
  buyBtns.forEach((element) => {
    element.addEventListener("click", (e) => {
      const { name, cost, increase } = upgrades[element.dataset.index];
      if (potatoData.totalPotatoes < cost) {
        announcements.textContent =
          "You do not have enough potatoes, to buy this upgrade....work harder!";
      } else {
        announcements.textContent = `You have activated ${name}`;
        potatoData.totalPotatoes -= cost;
        potatoData.potatoClickValue += increase;
        potatoData.potatoesPerSec += increase;
        saveGameState();
      }
    });
  });
};
buyUpgrade();

// Event listeners
audioBtn.addEventListener("click", audioHandler);
incrementPotatoBtn.addEventListener("click", incrementBtnHandler);
resetBtn.addEventListener("click", resetBtnHandler);
showPotatoUpgrades.addEventListener("click", showUpgrades);
