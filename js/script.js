'use strict';

//Функция проверки на число
let isNumber = function(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};


//Объявление переменных
let money,
  income = 'фриланс',
  addExpenses = prompt('Перечислите возможные расходы за рассчитываемый период через запятую', ''),
  deposit = confirm('Есть ли у вас депозит в банке?'),
  mission = 1e6,
  period = 12,
  expenses = [];


//Функция месячный доход
let start = function() {
  do {
    money = prompt('Ваш месячный доход?', '');
  }  while (!isNumber(money));
};

start();


//Определение типа данных
function showTypeOf(data) {
  return typeof(data);
}

console.log(money, showTypeOf(money));
console.log(income, showTypeOf(income));
console.log(deposit, showTypeOf(deposit));


//Возможные расходы
console.log(addExpenses.toLowerCase().split(', '));


//Сумма всех обязательных расходов за месяц
let getExpensesMonth = function() {
  let sum = 0;

  for (let i = 0; i < 2; i++) {
    expenses[i] = prompt('Введите обязательную статью расходов?', '');
    let amount;

    do {
      amount = prompt('Во сколько это обойдется?', '');
    } while (!isNumber(amount));
    sum += +amount;
  }
  
  console.log(expenses);
  return sum;
};

let expensesAmount = getExpensesMonth();

console.log('Расходы за месяц: ' + expensesAmount);


//Накопления за месяц
function getAccumulatedMonth() {
  return money - expensesAmount;
}

let accumulatedMonth = getAccumulatedMonth();


//Достижение цели
function getTargetMonth() {
  return ((mission / accumulatedMonth) < 0 || !isFinite(mission / accumulatedMonth)) ? 'Цель не будет достигнута' : Math.ceil(mission / accumulatedMonth);
}

console.log('Cрок достижения цели (в месяцах): ' + getTargetMonth());


//Бюджет на день
let budgetDay = Math.floor(accumulatedMonth / 30);
console.log(`Бюджет на день: ${budgetDay}`);


//Определение уровня дохода
function getStatusIncome() {
  if (budgetDay >= 1200) {
    return 'У вас высокий уровень дохода';
  } else if (budgetDay >= 600 && budgetDay < 1200) {
    return 'У вас средний уровень дохода';
  } else if (budgetDay >= 0 && budgetDay < 600) {
    return 'К сожалению у вас уровень дохода ниже среднего';
  } else {
    return 'Что то пошло не так';
  }
}

console.log(getStatusIncome());