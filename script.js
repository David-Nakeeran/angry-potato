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

// potato names
const potatoNames = [
  "Auto-Clicker",
  "Convection Oven",
  "Fan Assisted Oven",
  "Scorch And Sizzle",
  "Magma Maestro",
  "The Furnace",
  "Forge Of Flavours",
  "Bake Master 3000",
  "The Potato Portal",
  "God of Potatoes",
];

let timeoutId;

// Font Awesome Icon audio muted (should be popped in a function)
const i = document.createElement("i");
i.classList = "fa-solid fa-volume-xmark";

// Get data from local storage, if null create potatoData object
let potatoData = JSON.parse(localStorage.getItem("potatoGameData")) || {
  totalPotatoes: 0,
  potatoClickValue: 1,
  potatoesPerSec: 1,
  audioOn: true,
};

const loadAudioIconPref = () => {
  if (!potatoData.audioOn) {
    audioBtn.removeChild(audioOn);
    audioBtn.appendChild(i);
  }
};

// Save game state
const saveGameState = () => {
  localStorage.setItem("potatoGameData", JSON.stringify(potatoData));
};

// play audio
const playAudio = () => {
  if (potatoData.audioOn) {
    audioPop.currentTime = 0;
    audioPop.play();
  }
};

// Callback for setInterval
const incrementTotalPotatoes = () => {
  potatoData.totalPotatoes += potatoData.potatoesPerSec;
  totalPotatoesDisplay.innerHTML = `Total Potatoes: <span class="highlight">${potatoData.totalPotatoes}</span>`;
  displayPotatoesPerSecond();
  saveGameState();
};

const changeImageDelay = () => {
  potatoImg.src = "./assets/images/suprised-potatoe.png";
  clearTimeout(timeoutId); // cancels previous time out, spamming button clicks doesn't mess up changing img src
  setTimeout(() => {
    potatoImg.src = "./assets/images/angry-potatoe.png";
  }, 400);
};

// Callback for incrementBtn event listener
const incrementBtnHandler = () => {
  potatoData.totalPotatoes += potatoData.potatoClickValue;
  saveGameState();
  totalPotatoesDisplay.innerHTML = `Total Potatoes: <span class="highlight">${potatoData.totalPotatoes}</span>`;
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
    audioOn: true,
  };
  announcements.textContent = "";
};

// Callback show upgrades list
const showUpgrades = () => {
  upgradeContainer.classList.toggle("hidden");
};

// Callback handle audio
const audioHandler = () => {
  if (potatoData.audioOn) {
    audioBtn.removeChild(audioOn);
    audioBtn.appendChild(i);
    potatoData.audioOn = false;
    saveGameState();
  } else if (!potatoData.audioOn) {
    audioBtn.removeChild(i);
    audioBtn.appendChild(audioOn);
    potatoData.audioOn = true;
    saveGameState();
  }
};

// Set Interval
setInterval(incrementTotalPotatoes, 1000);

// Set Announcement text to empty string after delay
const clearAnnouncementText = () => {
  setTimeout(() => {
    announcements.textContent = "";
  }, 2000);
};

// Display potatoes per second
const displayPotatoesPerSecond = () => {
  potatoesPerSec.innerHTML = `Potatoes Per Sec: <span class="highlight">${potatoData.potatoesPerSec}</span>`;
};

// Fetch data from API
const getData = async () => {
  const url = "https://cookie-upgrade-api.vercel.app/api/upgrades";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(
        `Error fetching data, HTTP status code: ${response.status}`
      );
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
const createPotatoUpgradeElements = () => {
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

    namePara.textContent = potatoNames[index];
    costPara.textContent = `Cost ${element.cost} Potatoes`;
    PotatoValueUpgrade.textContent = `Increases PPS by ${element.increase}`;
    buyBtn.textContent = "Buy upgrade";

    div.append(namePara, costPara, PotatoValueUpgrade, buyBtn);
  });
};

const buyUpgrade = () => {
  const buyBtns = document.querySelectorAll("[data-index]");
  buyBtns.forEach((element, index) => {
    element.addEventListener("click", (e) => {
      const { name, cost, increase } = upgrades[element.dataset.index];
      if (potatoData.totalPotatoes < cost) {
        announcements.textContent =
          "You do not have enough potatoes, to buy this upgrade....work harder!";
        clearAnnouncementText();
      } else {
        announcements.textContent = `You have activated ${potatoNames[index]}`;
        clearAnnouncementText();
        potatoData.totalPotatoes -= cost;
        potatoData.potatoClickValue += increase;
        potatoData.potatoesPerSec += increase;
        saveGameState();
      }
    });
  });
};
loadAudioIconPref();
createPotatoUpgradeElements();
buyUpgrade();

// Event listeners
audioBtn.addEventListener("click", audioHandler);
incrementPotatoBtn.addEventListener("click", incrementBtnHandler);
resetBtn.addEventListener("click", resetBtnHandler);
showPotatoUpgrades.addEventListener("click", showUpgrades);
