'use strict';

//Функция проверки на число
let isNumber = function(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};


//Объявление переменных
let start = document.getElementById('start'),
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
  expensesItems = document.querySelectorAll('.expenses-items'),
  additionalExpensesItem = data.querySelector('.additional_expenses-item'),
  targetAmount = data.querySelector('.target-amount'),
  periodSelect = document.querySelector('.period-select'),
  incomeItems = document.querySelectorAll('.income-items'),
  periodAmount = document.querySelector('.period-amount'),
  cancel = document.getElementById('cancel');



//Создаем объект
const AppData = function() {
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
};

//Месячный доход
AppData.prototype.start = function() {
  this.budget = +salaryAmount.value;
  this.getExpenses();
  this.getIncome();
  this.getExpensesMonth();
  this.getAddExpenses();
  this.getAddIncome();
  this.getBudget();
  this.showResult();

  let inputsDisabled = data.querySelectorAll('input[type=text]');
  inputsDisabled.forEach(function(item) {
    item.disabled = true;
  });
  start.style.display = 'none';
  cancel.style.display = 'block';
};
//Добавить обязательные расходы
AppData.prototype.addExpensesBlock = function() {
  let cloneExpensesItem = expensesItems[0].cloneNode(true);

  for (let i = 0; i < cloneExpensesItem.children.length; i++) {
    cloneExpensesItem.children[i].value = null;
  }

  expensesItems[0].parentNode.insertBefore(cloneExpensesItem, expensesPlus);
  expensesItems = document.querySelectorAll('.expenses-items');

  if (expensesItems.length === 3) {
    expensesPlus.style.display = 'none';
  }
};
//Добавить дополнительные доходы
AppData.prototype.addIncomeBlock = function() {
  let cloneIncomeItem = incomeItems[0].cloneNode(true);

  for (let i = 0; i < cloneIncomeItem.children.length; i++) {
    cloneIncomeItem.children[i].value = null;
  }

  incomeItems[0].parentNode.insertBefore(cloneIncomeItem, incomePlus);
  incomeItems = document.querySelectorAll('.income-items');

  if (incomeItems.length === 3) {
    incomePlus.style.display = 'none';
  }
};
//Обязательные расходы
AppData.prototype.getExpenses = function() {
  expensesItems.forEach(function(item) {
    let itemExpenses = item.querySelector('.expenses-title').value,
      cashExpenses = item.querySelector('.expenses-amount').value;

      if (itemExpenses !== '' && cashExpenses !== '') {
        this.expenses[itemExpenses] = +cashExpenses;
      }
  }, this);
};
//Дополнительные доходы
AppData.prototype.getIncome = function() {
  incomeItems.forEach(function(item) {
    let itemIncome = item.querySelector('.income-title').value,
      cashIncome = item.querySelector('.income-amount').value;
      if (itemIncome !== '' && cashIncome !== '') {
        this.income[itemIncome] = +cashIncome;
      }
  }, this);

  for (let key in this.income) {
    this.incomeMonth += +this.income[key];
  }
};
//Показать результат вычислений
AppData.prototype.showResult = function() {
  budgetMonthValue.value = this.budgetMonth;
  budgetDayValue.value = this.budgetDay;
  expensesMonthValue.value = this.expensesMonth;
  additionalExpensesValue.value = this.addExpenses.join(', ');
  additionalIncomeValue.value = this.addIncome.join(', ');
  targetMonthValue.value = this.getTargetMonth();
  incomePeriodValue.value = this.calcPeriod();

  let calcValue = this.calcPeriod.bind(this);
  periodSelect.addEventListener('input', function() {
    incomePeriodValue.value = calcValue();
  });
};
//Возможные расходы
AppData.prototype.getAddExpenses = function() {
  let addExpenses = additionalExpensesItem.value.split(',');
  addExpenses.forEach(function(item) {
    item = item.trim();
    if (item !== '') {
      this.addExpenses.push(item);
    }
  }, this);
};
//Возможные доходы
AppData.prototype.getAddIncome = function() {
  additionalIncomeItem.forEach(function(item) {
    let itemValue = item.value.trim();
    if (itemValue !== '') {
      this.addIncome.push(itemValue);
    }
  }, this);
};
//Расходы за месяц
AppData.prototype.getExpensesMonth = function() {
  for (let key in this.expenses) {
    this.expensesMonth += +this.expenses[key];
  }
};
//Бюджеты на месяц и день
AppData.prototype.getBudget = function() {
  this.budgetMonth = this.budget + this.incomeMonth - this.expensesMonth;
  this.budgetDay = Math.floor(this.budgetMonth  / 30);
};
//Достижение цели
AppData.prototype.getTargetMonth = function() {
  return ((targetAmount.value / this.budgetMonth) < 0 || !isFinite(targetAmount.value / this.budgetMonth)) ? 'Цель не будет достигнута' : Math.ceil(targetAmount.value / this.budgetMonth);
};
//Уровень дохода
AppData.prototype.getStatusIncome = function() {
  if (this.budgetDay >= 1200) {
    return 'У вас высокий уровень дохода';
  } else if (this.budgetDay >= 600 && this.budgetDay < 1200) {
    return 'У вас средний уровень дохода';
  } else if (this.budgetDay >= 0 && this.budgetDay < 600) {
    return 'К сожалению у вас уровень дохода ниже среднего';
  } else {
    return 'Что то пошло не так';
  }
};
//Депозит в банке
AppData.prototype.getInfoDeposit = function() {
  this.deposit = confirm('Есть ли у вас депозит в банке?');
  if (this.deposit) {
    let percentDeposit, moneyDeposit;
    do {
      percentDeposit = prompt('Какой годовой процент?', 10);
    } while (!isNumber(this.percentDeposit));
    this.percentDeposit = +percentDeposit;
    do {
      moneyDeposit = prompt('Какая сумма заложена?', 10000);
    } while (!isNumber(this.moneyDeposit));
    this.moneyDeposit = +moneyDeposit;
  }
};
//Заработок за определенный период
AppData.prototype.calcPeriod = function() {
  return this.budgetMonth * periodSelect.value;
};
//Валидация чисел
AppData.prototype.validateNumber = function() {
  let income = data.querySelector('.income'),
    expenses = data.querySelector('.expenses');

  let replaceIncomeNumber = function() {
    let placeholderNumber = income.querySelectorAll('[placeholder="Сумма"]');
    placeholderNumber.forEach(function(item) {
      item.value = item.value.replace(/[^\d]/g, '');
    });
  };

  let replaceExpensesNumber = function() {
    let placeholderNumber = expenses.querySelectorAll('[placeholder="Сумма"]');
    placeholderNumber.forEach(function(item) {
      item.value = item.value.replace(/[^\d]/g, '');
    });
  };

  income.addEventListener('input', replaceIncomeNumber);
  expenses.addEventListener('input', replaceExpensesNumber);
  salaryAmount.addEventListener('input', function() {
    salaryAmount.value = salaryAmount.value.replace(/[^\d]/g, '');
  });
  targetAmount.addEventListener('input', function() {
    targetAmount.value = targetAmount.value.replace(/[^\d]/g, '');
  });
};
//Валидация слов
AppData.prototype.validateName = function() {
  let income = data.querySelector('.income'),
    expenses = data.querySelector('.expenses'),
    additionalIncome = data.querySelector('.additional_income');

  let replaceIncomeName = function() {
    let placeholderName = income.querySelectorAll('[placeholder="Наименование"]');
    placeholderName.forEach(function(item) {
      item.value = item.value.replace(/[^а-я\s\W]/g, '');
    });
  };

  let replaceExpensesName = function() {
    let placeholderName = expenses.querySelectorAll('[placeholder="Наименование"]');
    placeholderName.forEach(function(item) {
      item.value = item.value.replace(/[^а-я\s\W]/g, '');
    });
  };

  let replaceadditionalIncomeName = function() {
    let placeholderName = additionalIncome.querySelectorAll('[placeholder="Наименование"]');
    placeholderName.forEach(function(item) {
      item.value = item.value.replace(/[^а-я\s\W]/g, '');
    });
  };

  income.addEventListener('input', replaceIncomeName);
  expenses.addEventListener('input', replaceExpensesName);
  additionalIncome.addEventListener('input', replaceadditionalIncomeName);
};
//Сброса значений
AppData.prototype.reset = function() {
  let inputsDisabled = document.querySelectorAll('input[type=text]');
  inputsDisabled.forEach(function(item) {
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

  if (expensesItems.length > 1) {
    for (let i = 1; i < expensesItems.length; i++) {
      expensesItems[i].remove();
    }
  }

  if (incomeItems.length > 1) {
    for (let i = 1; i < incomeItems.length; i++) {
      incomeItems[i].remove();
    }
  }

  expensesPlus.style.display = 'block';
  incomePlus.style.display = 'block';

  periodSelect.value = 1;
  periodAmount.innerHTML = periodSelect.value;
  cancel.style.display = 'none';
  start.style.display = 'block';
  start.disabled = true;
};

AppData.prototype.eventsListeners = function() {
  const _this = this;
  this.validateNumber();
  this.validateName();

  start.disabled = true;

  salaryAmount.addEventListener('input', function() {
    if (salaryAmount.value !== '') {
      start.disabled = false;
    } else {
      start.disabled = true;
    }
  });

  let calculate = this.start.bind(this),
    addExpensesBlock = this.addExpensesBlock.bind(this),
    addIncomeBlock = this.addIncomeBlock.bind(this),
    reset = this.reset.bind(this);

  start.addEventListener('click', calculate);
  expensesPlus.addEventListener('click', addExpensesBlock);
  incomePlus.addEventListener('click', addIncomeBlock);

  periodSelect.addEventListener('input', function() {
    periodAmount.innerHTML = periodSelect.value;
  });

  cancel.addEventListener('click', reset);
};


const appData = new AppData();

appData.eventsListeners();




/*console.log('Расходы за месяц: ' + appData.expensesMonth);
console.log('Cрок достижения цели (в месяцах): ' + appData.getTargetMonth());
console.log(appData.getStatusIncome());

for (let key in appData) {
  console.log('Наша программа включает в себя данные: ', key, appData[key]);
}*/


//Функция показа строки из массива
/*let showString = function(arr) {
  let array = [];
  for (let i = 0; i < arr.length; i++) {
    array[i] = arr[i][0].toUpperCase() + arr[i].slice(1);
  }
  console.log(array.join(', '));
};

showString(appData.addExpenses);*/
