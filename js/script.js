'use strict';

//Функция проверки на число
let isNumber = function(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

let money,
//Функция месячный доход
  start = function() {
    do {
      money = prompt('Ваш месячный доход?', '');
    }  while (!isNumber(money));
  };

start();


//Создаем объект
let appData = {
  income: {},
  addIncome: [],
  expenses: {},
  addExpenses: [],
  deposit: false,
  mission: 50000,
  period: 3,
  budgetDay: 0,
  budgetMonth: 0,
  expensesMonth: 0,
  asking: function() {
    let addExpenses = prompt('Перечислите возможные расходы за рассчитываемый период через запятую', '');
    //Возможные расходы
    appData.addExpenses = addExpenses.toLowerCase().split(', ');
    appData.deposit = confirm('Есть ли у вас депозит в банке?');

    for (let i = 0; i < 2; i++) {
      let expense = prompt('Введите обязательную статью расходов?', ''),
        amount;

      do {
        amount = prompt('Во сколько это обойдется?', '');
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
};

appData.budget = +money;


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