const indicator = document.querySelector("[data-indicator]");
let password = "";
let passwordLength = 10;
let checkCount = 0;
//  strength circle color to grey
setIndicator("#ccc");

// set passwordLength
const inputSlider = document.querySelector("[data-lengthSlider]"); // syntax to write custom attribute
const lengthDisplay = document.querySelector("[data-lengthNumber]");
function handleSlider() {
  inputSlider.value = passwordLength;
  lengthDisplay.textContent = passwordLength;
}
handleSlider();

// set password Indicator

function setIndicator(color) {
  indicator.style.backgroundColor = color;
  indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRandomInteger(min, max) {
  // min included and max excluded
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
  return getRandomInteger(0, 10);
}

function generateLowerCase() {
  return String.fromCharCode(getRandomInteger(97, 123)); //97 ->a , 122 -> z
}

function generateUpperCase() {
  return String.fromCharCode(getRandomInteger(65, 91)); //65 ->A , 90 -> Z
}

const symbol = "~`!@#$%^&*()_+=-?/<>][}{";
function generateSymbol() {
  const randNum = getRandomInteger(0, symbol.length);
  return symbol.charAt(randNum);
}

const upperCaseCheck = document.querySelector("#uppercase");
const lowerCaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
function calculateStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNums = false;
  let hasSymbols = false;
  if (upperCaseCheck.checked) hasUpper = true;
  if (lowerCaseCheck.checked) hasLower = true;
  if (symbolsCheck.checked) hasSymbols = true;
  if (numbersCheck.checked) hasNums = true;

  if (hasUpper && hasLower && (hasNums || hasSymbols) && passwordLength >= 8) {
    setIndicator("#0f0");
  } else if (
    (hasLower || hasUpper) &&
    (hasNums || hasSymbols) &&
    passwordLength >= 6
  ) {
    setIndicator("#ff0");
  } else {
    setIndicator("#f00");
  }
}

function shufflePassword(array) {
  // fisher -yates shuffle
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }

  let str = "";
  array.forEach((el) => {
    str += el;
  });
  return str;
}

const allCheckBox = document.querySelectorAll("input[type=checkbox]");
// console.log(allCheckBox);
function handleCheckBoxChange() {
  checkCount = 0;
  allCheckBox.forEach((checkbox) => {
    if (checkbox.checked) {
      checkCount++;
    }
  });

  //   special condtion
  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }
}

allCheckBox.forEach((checkbox) => {
  checkbox.addEventListener("change", handleCheckBoxChange);
});

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyMsg = document.querySelector("[data-copyMsg]");
async function copyContent() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value); //check its working->passwordDisplay.textContent
    copyMsg.innerText = "Copied!";
  } catch (e) {
    copyMsg.innerText = "Failed!";
  }

  // to make copy span visible
  copyMsg.classList.add("active");

  setTimeout(() => {
    copyMsg.classList.remove("active");
  }, 2000);
}

inputSlider.addEventListener("input", (event) => {
  passwordLength = event.target.value;
  handleSlider();
});

const copyBtn = document.querySelector("[data-copy]");
copyBtn.addEventListener("click", () => {
  if (passwordDisplay.value) {
    copyContent();
  }
});

const generateBtn = document.querySelector(".generateButton");

generateBtn.addEventListener("click", () => {
  // non of checkbox is selected
  if (checkCount === 0) return;

  // password length
  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }

  // remove old password
  password = "";

  // put password one by one in funcArr

  let funcArr = [];
  //   console.log(funcArr);

  if (upperCaseCheck.checked) funcArr.push(generateUpperCase);

  if (lowerCaseCheck.checked) funcArr.push(generateLowerCase);

  if (numbersCheck.checked) funcArr.push(generateRandomNumber);

  if (symbolsCheck.checked) funcArr.push(generateSymbol);
  // console.log(funcArr);

  // compulsory Addition
  for (let i = 0; i < funcArr.length; i++) {
    password += funcArr[i]();
  }

  //   remaining additions
  for (let i = 0; i < passwordLength - funcArr.length; i++) {
    let randIndex = getRandomInteger(0, funcArr.length - 1);
    password += funcArr[randIndex]();
  }

  // shuffle the password
  password = shufflePassword(Array.from(password));
  passwordDisplay.value = password;
  calculateStrength();
});
