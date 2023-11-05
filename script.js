const display = document.querySelector(".display");
const buttons = document.querySelectorAll("button");
const specialChars = ["%", "*", "/", "-", "+", "="];

let output = "";
let memory = "";
let mrcClickCount = 0;
let decimalClicked = false;

// To limit the output's decimal places
const formatNumber = (num) => {
  const numString = num.toString();
  if (numString.length > 12) {
    return num.toExponential(8);
  }
  return numString;
};

const decimalToBinary = (num) => {
  let binaryRepresentation;

  if (Number.isInteger(num)) {
    binaryRepresentation = (Math.abs(num) >>> 0).toString(2);
  } else {
    let integerPart = Math.floor(Math.abs(num));
    let decimalPart = Math.abs(num) - integerPart;
    let binaryIntegerPart = (integerPart >>> 0).toString(2);
    let binaryDecimalPart = "";

    while (decimalPart > 0) {
      decimalPart *= 2;
      binaryDecimalPart += Math.floor(decimalPart).toString();
      decimalPart -= Math.floor(decimalPart);
    }

    binaryRepresentation =
      (num < 0 ? "-" : "") +
      binaryIntegerPart +
      (binaryDecimalPart !== "" ? "." + binaryDecimalPart : "");
  }

  return binaryRepresentation;
};

// Main operation
const calculate = (btnValue) => {
  display.focus();

  if (output === "" && specialChars.includes(btnValue)) {
    return;
  }

  // To check whether an operator is clicked
  const lastCharIsOperator = specialChars.includes(
    output.charAt(output.length - 1)
  );

  if (btnValue === "=" && output !== "") {
    output = formatNumber(eval(output.replace("%", "/100")));
  } else if (btnValue === "AC") {
    output = "";
    decimalClicked = false;
  } else if (btnValue === "DEL") {
    output = formatNumber(output.toString().slice(0, -1));
  } else if (btnValue === "BIN") {
    if (output !== "") {
      let num = parseFloat(eval(output));
      let binaryRepresentation = decimalToBinary(num);

      console.log(`Binary: ${binaryRepresentation}`);
      if (binaryRepresentation.length > 22) {
        output = "Error: Number too large";
      } else {
        output = binaryRepresentation;
      }

      decimalClicked = false;
    }
  } else if (specialChars.includes(btnValue)) {
    if (!lastCharIsOperator) {
      if (btnValue !== ".") {
        decimalClicked = false;
      }
      output += btnValue;
    }
  } else if (btnValue === "M+") {
    memory = eval(memory + parseFloat(eval(output)));
    decimalClicked = false;
    console.log(`Memory: ${memory}`);
  } else if (btnValue === "M-") {
    memory = eval(memory - parseFloat(eval(output)));
    decimalClicked = false;
    console.log(`Memory: ${memory}`);
  } else if (btnValue === "MC") {
    memory = "";
    console.log(`Memory: ${memory}`);
  } else if (btnValue === "MR") {
    output += memory;
    console.log(`Memory: ${memory}`);
  } else if (btnValue === ".") {
    if (!decimalClicked) {
      output += btnValue;
      decimalClicked = true;
    }
  } else {
    output += btnValue;
  }

  display.value = output;
};

buttons.forEach((button) => {
  button.addEventListener("click", (e) => calculate(e.target.dataset.value));
});
