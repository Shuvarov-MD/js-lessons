'use strict';

//Объявление переменных
let money = +prompt('Ваш месячный доход?', ''),
  income = 'фриланс',
  addExpenses = prompt('Перечислите возможные расходы за рассчитываемый период через запятую', ''),
  deposit = confirm('Есть ли у вас депозит в банке?'),
  mission = 1e6,
  period = 12,
  expenses1 = prompt('Введите обязательную статью расходов?', ''),
  amount1 = +prompt('Во сколько это обойдется?', ''),
  expenses2 = prompt('Введите обязательную статью расходов?', ''),
  amount2 = +prompt('Во сколько это обойдется?', '');


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
function getExpensesMonth() {
  return amount1 + amount2;
}

console.log('Расходы за месяц: ' + getExpensesMonth());


//Накопления за месяц
function getAccumulatedMonth() {
  return money - getExpensesMonth();
}

let accumulatedMonth = getAccumulatedMonth();


//Достижение цели
function getTargetMonth() {
  return Math.ceil(mission / accumulatedMonth);
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