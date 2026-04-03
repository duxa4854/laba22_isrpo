export class Calculator {
  constructor() {
    this.display = document.getElementById("display");

    if (!this.display) {
      console.error("Элемент #display не найден");
    }
    this.expression = "";
    this.hasError = false;
  }

  init() {
    const buttons = document.querySelectorAll(".buttons button");

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const value = button.getAttribute("data-value") || button.textContent;
        this.handleButtonClick(value);
      });
    });

    this.updateDisplay();
  }

  handleButtonClick(value) {
    if (this.hasError) {
      if (value === "C") {
        this.clear();
      }
      return;
    }

    if (value === "C") {
      this.clear();
    } else if (value === "=") {
      this.calculate();
    } else {
      this.addToExpression(value);
    }
  }

  addToExpression(value) {
    if (this.isOperator(value)) {
      if (!this.expression && value !== "-") {
        return;
      }

      if (this.isLastCharOperator()) {
        this.expression = this.expression.slice(0, -1) + value;
        this.updateDisplay();
        return;
      }
    }

    if (value === ".") {
      if (this.hasDuplicateDot()) {
        return;
      }
    }

    this.expression += value;
    this.updateDisplay();
  }

  calculate() {
    if (!this.expression || this.hasError) return;

    try {
      if (!this.isValidExpression(this.expression)) {
        throw new Error("Некорректное выражение");
      }

      const result = this.safeEvaluate(this.expression);

      if (!isFinite(result)) {
        throw new Error("Деление на ноль или переполнение");
      }
      const roundedResult = Math.round(result * 100000000) / 100000000;

      this.expression = String(roundedResult);
      this.hasError = false;
      this.updateDisplay();
    } catch (error) {
      console.error(error);
      this.showError("Ошибка");
    }
  }

  safeEvaluate(expr) {
    return new Function("return " + expr)();
  }

  isValidExpression(expr) {
    expr = expr.replace(/\s+/g, "");
    if (/[+\-*/]$/.test(expr)) {
      return false;
    }

    if (/[^0-9+\-*/.]/.test(expr)) {
      return false;
    }

    return true;
  }

  clear() {
    this.expression = "";
    this.hasError = false;
    this.updateDisplay();
  }

  updateDisplay() {
    if (this.hasError) return;
    this.display.value = this.expression || "0";
  }

  showError(message) {
    this.display.value = message;
    this.hasError = true;
    this.expression = "";
  }

  isOperator(char) {
    return ["+", "-", "*", "/"].includes(char);
  }

  isLastCharOperator() {
    if (!this.expression) return false;
    const lastChar = this.expression.slice(-1);
    return this.isOperator(lastChar);
  }

  hasDuplicateDot() {
    const parts = this.expression.split(/[+\-*/]/);
    const lastNumber = parts[parts.length - 1];
    return lastNumber.includes(".");
  }
}
