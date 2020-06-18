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
  periodAmount = document.querySelector('.period-amount');
 /* placeholderSum = document.querySelectorAll('[placeholder="Сумма"]'),
  placeholderName = document.querySelectorAll('[placeholder="Наименование"]');*/

//Создаем объект
const appData = {
  budget: 0,
  income: {},
  incomeMonth: 0,
  addIncome: [],
  expenses: {},
  addExpenses: [],
  deposit: false,
  percentDeposit: 0,
  moneyDeposit: 0,
  budgetDay: 0,
  budgetMonth: 0,
  expensesMonth: 0,
  //Месячный доход
  start: function() {
    appData.budget = +salaryAmount.value;

    appData.getExpenses();
    appData.getIncome();
    appData.getExpensesMonth();
    appData.getAddExpenses();
    appData.getAddIncome();
    appData.getBudget();
    appData.showResult();
  },
  //Добавить обязательные расходы
  addExpensesBlock: function() {
    let cloneExpensesItem = expensesItems[0].cloneNode(true);

    for (let i = 0; i < cloneExpensesItem.children.length; i++) {
      cloneExpensesItem.children[i].value = null;
    }
    expensesItems[0].parentNode.insertBefore(cloneExpensesItem, expensesPlus);
    expensesItems = document.querySelectorAll('.expenses-items');
    appData.validateNumber();
    appData.validateName();

    if (expensesItems.length === 3) {
      expensesPlus.style.display = 'none';
    }
  },
  //Добавить дополнительные доходы
  addIncomeBlock: function() {
    let cloneIncomeItem = incomeItems[0].cloneNode(true);

    for (let i = 0; i < cloneIncomeItem.children.length; i++) {
      cloneIncomeItem.children[i].value = null;
    }
    
    incomeItems[0].parentNode.insertBefore(cloneIncomeItem, incomePlus);
    incomeItems = document.querySelectorAll('.income-items');
    appData.validateNumber();
    appData.validateName();

    if (incomeItems.length === 3) {
      incomePlus.style.display = 'none';
    }
  },
  //Обязательные расходы
  getExpenses: function() {
    expensesItems.forEach(function(item) {
      let itemExpenses = item.querySelector('.expenses-title').value,
        cashExpenses = item.querySelector('.expenses-amount').value;

        if (itemExpenses !== '' && cashExpenses !== '') {
          appData.expenses[itemExpenses] = +cashExpenses;
        }
    });
  },
  //Дополнительные доходы
  getIncome: function() {
    incomeItems.forEach(function(item) {
      let itemIncome = item.querySelector('.income-title').value,
        cashIncome = item.querySelector('.income-amount').value;
        if (itemIncome !== '' && cashIncome !== '') {
          appData.income[itemIncome] = +cashIncome;
        }
    });

    for (let key in appData.income) {
      appData.incomeMonth += +appData.income[key];
    }
  },
  //Показать результат вычислений
  showResult: function() {
    budgetMonthValue.value = appData.budgetMonth;
    budgetDayValue.value = appData.budgetDay;
    expensesMonthValue.value = appData.expensesMonth;
    additionalExpensesValue.value = appData.addExpenses.join(', ');
    additionalIncomeValue.value = appData.addIncome.join(', ');
    targetMonthValue.value = appData.getTargetMonth();
    incomePeriodValue.value = appData.calcPeriod();

    periodSelect.addEventListener('input', function() {
      incomePeriodValue.value = appData.calcPeriod();
    });
  },
  //Возможные расходы
  getAddExpenses: function() {
    let addExpenses = additionalExpensesItem.value.split(',');
    addExpenses.forEach(function(item) {
      item = item.trim();
      if (item !== '') {
        appData.addExpenses.push(item);
      }
    });
  },
  //Возможные доходы
  getAddIncome: function() {
    additionalIncomeItem.forEach(function(item) {
      let itemValue = item.value.trim();
      if (itemValue !== '') {
        appData.addIncome.push(itemValue);
      }
    });
  },
  //Расходы за месяц
  getExpensesMonth: function() {
    for (let key in appData.expenses) {
      appData.expensesMonth += +appData.expenses[key];
    }
  },
  //Бюджеты на месяц и день
  getBudget: function() {
    appData.budgetMonth = appData.budget + appData.incomeMonth - appData.expensesMonth;
    appData.budgetDay = Math.floor(appData.budgetMonth  / 30);
  },
  //Достижение цели
  getTargetMonth: function() {
    return ((targetAmount.value / appData.budgetMonth) < 0 || !isFinite(targetAmount.value / appData.budgetMonth)) ? 'Цель не будет достигнута' : Math.ceil(targetAmount.value / appData.budgetMonth);
  },
  //Уровень дохода
  getStatusIncome: function() {
    if (appData.budgetDay >= 1200) {
      return 'У вас высокий уровень дохода';
    } else if (appData.budgetDay >= 600 && appData.budgetDay < 1200) {
      return 'У вас средний уровень дохода';
    } else if (appData.budgetDay >= 0 && appData.budgetDay < 600) {
      return 'К сожалению у вас уровень дохода ниже среднего';
    } else {
      return 'Что то пошло не так';
    }
  },
  //Депозит в банке
  getInfoDeposit: function() {
    appData.deposit = confirm('Есть ли у вас депозит в банке?');
    if (appData.deposit) {
      let percentDeposit, moneyDeposit;
      do {
        percentDeposit = prompt('Какой годовой процент?', 10);
      } while (!isNumber(appData.percentDeposit));
      appData.percentDeposit = +percentDeposit;
      do {
        moneyDeposit = prompt('Какая сумма заложена?', 10000);
      } while (!isNumber(appData.moneyDeposit));
      appData.moneyDeposit = +moneyDeposit;
    }
  },
  //Заработок за определенный период
  calcPeriod: function() {
    return appData.budgetMonth * periodSelect.value;
  },
  //Валидация чисел
  validateNumber: function() {
    let placeholderSum = document.querySelectorAll('[placeholder="Сумма"]');
    placeholderSum.forEach(function(item) {
      item.addEventListener('input', function() {
        item.value = item.value.replace(/[^\d]/g, '');
      });
    });
  },
  //Валидация слов
  validateName: function() {
    let placeholderName = document.querySelectorAll('[placeholder="Наименование"]');
    placeholderName.forEach(function(item) {
      item.addEventListener('input', function() {
        item.value = item.value.replace(/[^а-я\s\W]/g, '');
      });
    });
  }
};


appData.validateNumber();
appData.validateName();

start.disabled = true;

salaryAmount.addEventListener('input', function() {
  if (salaryAmount.value !== '') {
    start.disabled = false;
  } else {
    start.disabled = true;
  }
});
start.addEventListener('click', appData.start);
expensesPlus.addEventListener('click', appData.addExpensesBlock);
incomePlus.addEventListener('click', appData.addIncomeBlock);

periodSelect.addEventListener('input', function() {
  periodAmount.innerHTML = periodSelect.value;
});


/*console.log('Расходы за месяц: ' + appData.expensesMonth);
console.log('Cрок достижения цели (в месяцах): ' + appData.getTargetMonth());
console.log(appData.getStatusIncome());

for (let key in appData) {
  console.log('Наша программа включает в себя данные: ', key, appData[key]);
}*/


//Функция показа строки из массива
let showString = function(arr) {
  let array = [];
  for (let i = 0; i < arr.length; i++) {
    array[i] = arr[i][0].toUpperCase() + arr[i].slice(1);
  }
  console.log(array.join(', '));
};

showString(appData.addExpenses);