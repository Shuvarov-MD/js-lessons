'use strict';

//Функция проверки на число
const isNumber = (n) => !isNaN(parseFloat(n)) && isFinite(n);


//Объявление переменных
const start = document.getElementById('start'),
  incomePlus = document.getElementsByTagName('button')[0],
  expensesPlus = document.getElementsByTagName('button')[1],
  depositCheck = document.querySelector('#deposit-check'),
  additionalIncomeItem = document.querySelectorAll('.additional_income-item'),
  result = document.querySelector('.result'),
  budgetMonthValue = result.getElementsByClassName('budget_month-value')[0],
  budgetDayValue = result.getElementsByClassName('budget_day-value')[0],
  expensesMonthValue = result.getElementsByClassName('expenses_month-value')[0],
  additionalIncomeValue = result.getElementsByClassName('additional_income-value')[0],
  additionalExpensesValue = result.getElementsByClassName('additional_expenses-value')[0],
  incomePeriodValue = result.getElementsByClassName('income_period-value')[0],
  targetMonthValue = result.getElementsByClassName('target_month-value')[0],
  data = document.querySelector('.data'),
  salaryAmount = data.querySelector('.salary-amount'),
  incomeTitle = data.querySelector('input.income-title'),
  expensesTitle = data.querySelector('input.expenses-title'),
  additionalExpensesItem = data.querySelector('.additional_expenses-item'),
  targetAmount = data.querySelector('.target-amount'),
  periodSelect = document.querySelector('.period-select'),
  periodAmount = document.querySelector('.period-amount'),
  cancel = document.getElementById('cancel'),
  depositBank = document.querySelector('.deposit-bank'),
  depositAmount = document.querySelector('.deposit-amount'),
  depositPercent = document.querySelector('.deposit-percent');

let expensesItems = document.querySelectorAll('.expenses-items'),
  incomeItems = document.querySelectorAll('.income-items');

//Класс AppData
class AppData {
  constructor() {
    this.budget = 0;
    this.income = {};
    this.incomeMonth = 0;
    this.addIncome = [];
    this.expenses = {};
    this.addExpenses = [];
    this.deposit = false;
    this.percentDeposit = 0;
    this.moneyDeposit = 0;
    this.budgetDay = 0;
    this.budgetMonth = 0;
    this.expensesMonth = 0;
  }

  //Месячный доход
  start() {
    this.budget = +salaryAmount.value;
    this.getExpInc();
    this.getAddExpInc('addExpenses');
    this.getAddExpInc('addIncome');
    this.getInfoDeposit();
    this.getBudget();
    this.showResult();

    const inputsDisabled = data.querySelectorAll('input[type=text]');
    inputsDisabled.forEach((item) => item.disabled = true);
    start.style.display = 'none';
    cancel.style.display = 'block';
  }

  //Добавить дополнительные доходы и обязательные расходы
  addIncExpBlock(param) {
    let item = document.querySelectorAll(`.${param}-items`);
    const cloneItem = item[0].cloneNode(true),
      itemPlus = document.querySelector(`.${param}_add`);

    for (let i = 0; i < cloneItem.children.length; i++) {
      cloneItem.children[i].value = null;
    }

    item[0].parentNode.insertBefore(cloneItem, itemPlus);
    item = document.querySelectorAll(`.${param}-items`);

    if (item.length === 3) {
      itemPlus.style.display = 'none';
    }
  }

  //Дополнительные доходы и расходы
  getExpInc() {
    const count = (item) => {
      const startStr = item.className.split('-')[0],
        itemTitle = item.querySelector(`.${startStr}-title`).value,
        itemAmount = item.querySelector(`.${startStr}-amount`).value;

        if (itemTitle !== '' && itemAmount !== '') {
          this[startStr][itemTitle] = +itemAmount;
        }
    };

    expensesItems = document.querySelectorAll('.expenses-items');
    incomeItems = document.querySelectorAll('.income-items');

    incomeItems.forEach(count);
    expensesItems.forEach(count);

    for (let key in this.income) {
      this.incomeMonth += +this.income[key];
    }

    for (let key in this.expenses) {
      this.expensesMonth += +this.expenses[key];
    }
  }

  //Показать результат вычислений
  showResult() {
    budgetMonthValue.value = this.budgetMonth;
    budgetDayValue.value = this.budgetDay;
    expensesMonthValue.value = this.expensesMonth;
    additionalExpensesValue.value = this.addExpenses.join(', ');
    additionalIncomeValue.value = this.addIncome.join(', ');
    targetMonthValue.value = this.getTargetMonth();
    incomePeriodValue.value = this.calcPeriod();

    const calcValue = this.calcPeriod.bind(this);
    periodSelect.addEventListener('input', () => incomePeriodValue.value = calcValue());
  }

  //Возможные доходы и расходы
  getAddExpInc(param) {
    let addItem;
    if (param === 'addIncome') {
      addItem = additionalIncomeItem;
    } else {
      addItem = additionalExpensesItem.value.split(',');
    }
    const count = (item) => {
      if (addItem === additionalIncomeItem) {
        let itemValue = item.value.trim();

        if (itemValue !== '') {
          this[param].push(itemValue);
        }
      } else {
        item = item.trim();

        if (item !== '') {
          this[param].push(item);
        }
      }
    };

    addItem.forEach(count);
  }

  //Бюджеты на месяц и день
  getBudget() {
    const monthDeposit = this.moneyDeposit * (this.percentDeposit / 100);
    this.budgetMonth = this.budget + this.incomeMonth - this.expensesMonth + monthDeposit;
    this.budgetDay = Math.floor(this.budgetMonth  / 30);
  }

  //Достижение цели
  getTargetMonth() {
    return ((targetAmount.value / this.budgetMonth) < 0 || !isFinite(targetAmount.value / this.budgetMonth)) ? 'Цель не будет достигнута' : Math.ceil(targetAmount.value / this.budgetMonth);
  }

  //Уровень дохода
  getStatusIncome() {
    if (this.budgetDay >= 1200) {
      return 'У вас высокий уровень дохода';
    } else if (this.budgetDay >= 600 && this.budgetDay < 1200) {
      return 'У вас средний уровень дохода';
    } else if (this.budgetDay >= 0 && this.budgetDay < 600) {
      return 'К сожалению у вас уровень дохода ниже среднего';
    } else {
      return 'Что то пошло не так';
    }
  }

  //Депозит в банке
  getInfoDeposit() {
    if (this.deposit) {
      this.percentDeposit = depositPercent.value;
      this.moneyDeposit = depositAmount.value;
    }
  }

  //Заработок за определенный период
  calcPeriod() {
    return this.budgetMonth * periodSelect.value;
  }

  //Валидация чисел
  validateNumber() {
    const income = data.querySelector('.income'),
      expenses = data.querySelector('.expenses');

    const replaceIncomeNumber = () => {
      const placeholderNumber = income.querySelectorAll('[placeholder="Сумма"]');
      placeholderNumber.forEach((item) => item.value = item.value.replace(/[^\d]/g, ''));
    };

    const replaceExpensesNumber = () => {
      const placeholderNumber = expenses.querySelectorAll('[placeholder="Сумма"]');
      placeholderNumber.forEach((item) => item.value = item.value.replace(/[^\d]/g, ''));
    };

    income.addEventListener('input', replaceIncomeNumber);
    expenses.addEventListener('input', replaceExpensesNumber);
    salaryAmount.addEventListener('input', () => salaryAmount.value = salaryAmount.value.replace(/[^\d]/g, ''));
    targetAmount.addEventListener('input', () => targetAmount.value = targetAmount.value.replace(/[^\d]/g, ''));
  }

  //Валидация слов
  validateName() {
    const income = data.querySelector('.income'),
      expenses = data.querySelector('.expenses'),
      additionalIncome = data.querySelector('.additional_income');

    const replaceIncomeName = () => {
      const placeholderName = income.querySelectorAll('[placeholder="Наименование"]');

      placeholderName.forEach((item) => item.value = item.value.replace(/[^а-я\s\W]/g, ''));
    };

    const replaceExpensesName = () => {
      const placeholderName = expenses.querySelectorAll('[placeholder="Наименование"]');

      placeholderName.forEach((item) => item.value = item.value.replace(/[^а-я\s\W]/g, ''));
    };

    const replaceadditionalIncomeName = () => {
      const placeholderName = additionalIncome.querySelectorAll('[placeholder="Наименование"]');

      placeholderName.forEach((item) => item.value = item.value.replace(/[^а-я\s\W]/g, ''));
    };

    income.addEventListener('input', replaceIncomeName);
    expenses.addEventListener('input', replaceExpensesName);
    additionalIncome.addEventListener('input', replaceadditionalIncomeName);
  }

  //Сброса значений
  reset() {
    const inputsDisabled = document.querySelectorAll('input[type=text]');
    inputsDisabled.forEach((item) => {
      item.disabled = false;
      item.value = null;
    });

    this.budget = 0;
    this.income = {};
    this.incomeMonth = 0;
    this.addIncome = [];
    this.expenses = {};
    this.addExpenses = [];
    this.deposit = false;
    this.percentDeposit = 0;
    this.moneyDeposit = 0;
    this.budgetDay = 0;
    this.budgetMonth = 0;
    this.expensesMonth = 0;

    expensesItems = document.querySelectorAll('.expenses-items');
    if (expensesItems.length > 1) {
      for (let i = 1; i < expensesItems.length; i++) {
        expensesItems[i].remove();
      }
    }

    incomeItems = document.querySelectorAll('.income-items');
    if (incomeItems.length > 1) {
      for (let i = 1; i < incomeItems.length; i++) {
        incomeItems[i].remove();
      }
    }

    depositCheck.checked = false;
    depositBank.style.display = 'none';
    depositAmount.style.display = 'none';
    depositPercent.style.display = 'none';
    depositBank.value = '';
    depositAmount.value = '';

    expensesPlus.style.display = 'block';
    incomePlus.style.display = 'block';

    periodSelect.value = 1;
    periodAmount.innerHTML = periodSelect.value;
    cancel.style.display = 'none';
    start.style.display = 'block';
    start.disabled = true;
  }

  changePercent() {
    const valueSelect = this.value;
    if (valueSelect === 'other') {
      depositPercent.style.display = 'inline-block';
      depositPercent.value = '';
      depositPercent.addEventListener('blur', () => {
        if (!isNumber(depositPercent.value) || depositPercent.value < 0 || depositPercent.value > 100) {
          start.disabled = true;
          alert('Введите корректное значение в поле проценты');
        } else {
          start.disabled = false;
        }
      });
    } else {
      depositPercent.value = valueSelect;
      depositPercent.style.display = 'none';
    }
  }

  //Выбор депозита
  depositHandler() {
    if (depositCheck.checked) {
      depositBank.style.display = 'inline-block';
      depositAmount.style.display = 'inline-block';
      this.deposit = true;
      depositBank.addEventListener('change', this.changePercent);
    } else {
      depositBank.style.display = 'none';
      depositAmount.style.display = 'none';
      depositPercent.style.display = 'none';
      depositBank.value = '';
      depositAmount.value = '';
      this.deposit = false;
      depositBank.removeEventListener('change', this.changePercent);
    }
  }

  //События
  eventsListeners() {
    this.validateNumber();
    this.validateName();

    start.disabled = true;

    salaryAmount.addEventListener('input', () => {
      if (salaryAmount.value !== '') {
        start.disabled = false;
      } else {
        start.disabled = true;
      }
    });

    start.addEventListener('click', this.start.bind(this));
    expensesPlus.addEventListener('click', () => {
      this.addIncExpBlock('expenses');
    });
    incomePlus.addEventListener('click', () => {
      this.addIncExpBlock('income');
    });

    periodSelect.addEventListener('input', () => periodAmount.innerHTML = periodSelect.value);

    cancel.addEventListener('click', () => {
      this.reset();
    });

    depositCheck.addEventListener('change', this.depositHandler.bind(this));
  }
}


//Создаем объект
const appData = new AppData();

appData.eventsListeners();




/*console.log('Расходы за месяц: ' + appData.expensesMonth);
console.log('Cрок достижения цели (в месяцах): ' + appData.getTargetMonth());
console.log(appData.getStatusIncome());

for (let key in appData) {
  console.log('Наша программа включает в себя данные: ', key, appData[key]);
}*/


//Функция показа строки из массива
/*const showString = (arr) => {
  const array = [];
  for (let i = 0; i < arr.length; i++) {
    array[i] = arr[i][0].toUpperCase() + arr[i].slice(1);
  }
  console.log(array.join(', '));
};

showString(appData.addExpenses);*/