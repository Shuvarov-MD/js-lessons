'use strict';

//Функция проверки на число
let isNumber = function(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

let money,
//Функция месячный доход
  start = function() {
    do {
      money = prompt('Ваш месячный доход?', 50000);
    }  while (!isNumber(money));
  };

start();

//Объявление переменных
let buttonStart = document.getElementById('start'),
  plus1 = document.getElementsByTagName('button')[0],
  plus2 = document.getElementsByTagName('button')[1],
  depositCheck = document.querySelector('#deposit-check'),
  additionalIncomeItem1 = document.querySelectorAll('.additional_income-item')[0],
  additionalIncomeItem2 = document.querySelectorAll('.additional_income-item')[1],
  result = document.querySelector('.result'),
  budgetDayValue = result.getElementsByClassName('budget_day-value'),
  expensesMonthValue = result.getElementsByClassName('expenses_month-value'),
  additionalIncomeValue = result.getElementsByClassName('additional_income-value'),
  additionalExpensesValue = result.getElementsByClassName('additional_expenses-value'),
  incomePeriodValue = result.getElementsByClassName('income_period-value'),
  targetMonthValue = result.getElementsByClassName('target_month-value'),
  data = document.querySelector('.data'),
  salaryAmount = data.querySelector('.salary-amount'),
  incomeTitle = data.querySelector('input.income-title'),
  incomeAmount = data.querySelector('.income-amount'),
  expensesTitle = data.querySelector('input.expenses-title'),
  expensesAmount = data.querySelector('.expenses-amount'),
  additionalExpensesItem = data.querySelector('.additional_expenses-item'),
  targetAmount = data.querySelector('.target-amount'),
  periodSelect = document.querySelector('.period-select');


//Создаем объект
const appData = {
  budget: +money,
  income: {},
  addIncome: [],
  expenses: {},
  addExpenses: [],
  deposit: false,
  percentDeposit: 0,
  moneyDeposit: 0,
  mission: 50000,
  period: 3,
  budgetDay: 0,
  budgetMonth: 0,
  expensesMonth: 0,
  asking: function() {
    //Дополнительный заработок
    if (confirm('Есть ли у вас дополнительный источник заработка?')) {
      let cashIncome, itemIncome;
      do {
        itemIncome = prompt('Какой у вас дополнительный заработок?', 'Таксую').trim();
      } while (isNumber(itemIncome));
      do {
        cashIncome = prompt('Сколько в месяц вы зарабатываете?', 10000);
      } while (!isNumber(cashIncome));
      appData.income[itemIncome] = +cashIncome;
    }

    let addExpenses = prompt('Перечислите возможные расходы за рассчитываемый период через запятую', 'Квартплата, бензин, кредит');
    //Возможные расходы
    appData.addExpenses = addExpenses.toLowerCase().split(', ');
    for (let i = 0; i < appData.addExpenses.length; i++) {
      appData.addExpenses[i] = appData.addExpenses[i].trim();
    }
    appData.deposit = confirm('Есть ли у вас депозит в банке?');

    for (let i = 0; i < 2; i++) {
      let expense, amount;
      do {
        expense = prompt('Введите обязательную статью расходов?', 'Кредит').trim();
      } while (isNumber(expense));
      do {
        amount = prompt('Во сколько это обойдется?', 5000);
      } while (!isNumber(amount));
      appData.expenses[expense] = +amount;
    }
  },
  //Расходы за месяц
  getExpensesMonth: function() {
    for (let key in appData.expenses) {
      appData.expensesMonth += appData.expenses[key];
    }
  },
  //Бюджеты на месяц и день
  getBudget: function() {
    appData.budgetMonth = appData.budget - appData.expensesMonth;
    appData.budgetDay = Math.floor(appData.budgetMonth  / 30);
  },
  //Достижение цели
  getTargetMonth: function() {
    return ((appData.mission / appData.budgetMonth ) < 0 || !isFinite(appData.mission / appData.budgetMonth )) ? 'Цель не будет достигнута' : Math.ceil(appData.mission / appData.budgetMonth );
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
  calcSavedMoney: function() {
    return appData.budgetMonth * appData.period;
  }
};

appData.asking();
appData.getExpensesMonth();
appData.getBudget();
appData.getTargetMonth();
appData.getStatusIncome();

console.log('Расходы за месяц: ' + appData.expensesMonth);
console.log('Cрок достижения цели (в месяцах): ' + appData.getTargetMonth());
console.log(appData.getStatusIncome());

for (let key in appData) {
  console.log('Наша программа включает в себя данные: ', key, appData[key]);
}

//Функция показа строки из массива
let showString = function(arr) {
  let array = [];
  for (let i = 0; i < arr.length; i++) {
    array[i] = arr[i][0].toUpperCase() + arr[i].slice(1);
  }
  console.log(array.join(', '));
};

showString(appData.addExpenses);