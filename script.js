// dom elements
const resetBtn = document.getElementById("reset");
const totalCookiesDisplay = document.getElementById("total-cookies");
const incrementCookieBtn = document.getElementById("cookie-increment-btn");
const cookiesPerSec = document.getElementById("cps");

// Get data from local storage, if null create cookiedata object
let cookieData = JSON.parse(localStorage.getItem("cookieGameData")) || {
  totalCookies: 0,
  cookieClickValue: 1,
  cookiesPerSec: 1,
};

// Callbacks
// Callback for setInterval
const incrementTotalCookies = () => {
  cookieData.totalCookies += cookieData.cookiesPerSec;
  totalCookiesDisplay.textContent = `${cookieData.totalCookies}`;
  displayCookiesPerSec();
  localStorage.setItem("cookieGameData", JSON.stringify(cookieData));
};

// Callback for incrementBtn event listener
const incrementBtnHandler = () => {
  cookieData.totalCookies += cookieData.cookieClickValue;
  totalCookiesDisplay.textContent = `${cookieData.totalCookies}`;
};

// Callback for resetBtn event listener
const resetBtnHandler = () => {
  localStorage.clear();
  cookieData = {
    totalCookies: 0,
    cookieClickValue: 1,
    cookiesPerSec: 1,
  };
};

// Set Interval
setInterval(incrementTotalCookies, 1000);

// Event listeners
incrementCookieBtn.addEventListener("click", incrementBtnHandler);
resetBtn.addEventListener("click", resetBtnHandler);

// Display cookies per second
const displayCookiesPerSec = () => {
  cookiesPerSec.textContent = `${cookieData.cookiesPerSec}`;
};
