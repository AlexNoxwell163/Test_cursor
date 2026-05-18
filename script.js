/*
 * Калькулятор услуг V2 — логика в отдельном файле.
 * Тарифы, расчёт и UI связаны через параметры (без глобальных DOM-переменных).
 */

/** Все тарифы в одном месте; в recalculate() передаётся как аргумент */
var PRICES = {
  trip: 500,
  cleaning: {
    full: 2000,
    room: 1000,
    perSqm: 50,
  },
  repair: {
    full: 5000,
    room: 2000,
    perSqm: 200,
    demolition: 1500,
    garbage: 800,
  },
  care: {
    elderly: 300,
    disabled: 400,
    child: 250,
    time: 300,
  },
};

/**
 * Конструктор услуги: название для экрана + функция расчёта.
 * Логика конкретной услуги живёт в calculateFn(prices, input).
 */
function Service(id, label, calculateFn) {
  this.id = id;
  this.label = label;
  this.calculateFn = calculateFn;
}

/** Вызов расчёта услуги — единая точка вместо трёх отдельных функций */
Service.prototype.calculate = function (prices, input) {
  return this.calculateFn(prices, input);
};

/**
 * Универсальный расчёт: любая услуга через объект Service.
 * input — снимок полей формы (тип, площадь, часы, чекбоксы).
 */
function calculateServiceCost(service, prices, input) {
  return service.calculate(prices, input);
}

/** Общая схема «полный / комната / площадь» для клининга и ремонта */
function costByTypeOrArea(tariffs, input) {
  if (input.type === "full") {
    return tariffs.full;
  }
  if (input.type === "room") {
    return tariffs.room;
  }
  if (input.type === "area") {
    return input.sqm * tariffs.perSqm;
  }
  return 0;
}

/** Создаём три услуги один раз; дальше работаем только с Service */
function createServices() {
  return {
    cleaning: new Service("cleaning", "Клининг", function (prices, input) {
      return costByTypeOrArea(prices.cleaning, input);
    }),
    repair: new Service("repair", "Ремонт", function (prices, input) {
      var cost = costByTypeOrArea(prices.repair, input);
      if (input.demolition) {
        cost = cost + prices.repair.demolition;
      }
      if (input.garbage) {
        cost = cost + prices.repair.garbage;
      }
      return cost;
    }),
    care: new Service("care", "Уход", function (prices, input) {
      var rate = prices.care.elderly;
      if (input.type === "disabled") {
        rate = prices.care.disabled;
      } else if (input.type === "child") {
        rate = prices.care.child;
      } else if (input.type === "time") {
        rate = prices.care.time;
      }
      return rate * input.hours;
    }),
  };
}

/** Убрать сообщение об ошибке и красную рамку */
function clearFieldError(inputEl, errorEl) {
  if (!errorEl) {
    return;
  }
  errorEl.textContent = "";
  errorEl.className = "field-error hidden";
  inputEl.classList.remove("input-invalid");
}

/** Показать понятное сообщение рядом с полем */
function showFieldError(inputEl, errorEl, message) {
  errorEl.textContent = message;
  errorEl.className = "field-error";
  inputEl.classList.add("input-invalid");
}

/**
 * Проверка поля «площадь» или «часы»:
 * буквы и отрицательные числа → в поле ставим 0, показываем ошибку.
 * Корректное число → ошибку скрываем, возвращаем его для расчёта.
 */
function validateNumberField(inputEl, errorEl) {
  var raw = String(inputEl.value).trim();

  // Пустое поле: для расчёта считаем 0, ошибку не показываем
  if (raw === "") {
    clearFieldError(inputEl, errorEl);
    return 0;
  }

  var n = Number(raw);
  var hasLetter = /[a-zA-Zа-яА-ЯёЁ]/.test(raw);

  if (hasLetter || isNaN(n)) {
    inputEl.value = 0;
    showFieldError(
      inputEl,
      errorEl,
      "Нужно число от 0 и выше. Буквы не подходят — подставили 0."
    );
    return 0;
  }

  if (n < 0) {
    inputEl.value = 0;
    showFieldError(
      inputEl,
      errorEl,
      "Число не может быть отрицательным. Подставили 0."
    );
    return 0;
  }

  clearFieldError(inputEl, errorEl);
  return n;
}

function getSelectedRadioValue(doc, groupName) {
  var list = doc.querySelectorAll('input[name="' + groupName + '"]');
  var i;
  for (i = 0; i < list.length; i++) {
    if (list[i].checked) {
      return list[i].value;
    }
  }
  return "";
}

/** Собираем данные формы в объект — его передаём в расчёт, а не читаем DOM внутри Service */
function readFormState(doc, refs) {
  return {
    category: getSelectedRadioValue(doc, "category"),
    cleaning: {
      type: getSelectedRadioValue(doc, "cleaning-type"),
      sqm: validateNumberField(
        doc.getElementById("cleaning-sqm"),
        refs.cleaningSqmError
      ),
    },
    repair: {
      type: getSelectedRadioValue(doc, "repair-type"),
      sqm: validateNumberField(
        doc.getElementById("repair-sqm"),
        refs.repairSqmError
      ),
      demolition: doc.getElementById("repair-demolition").checked,
      garbage: doc.getElementById("repair-garbage").checked,
    },
    care: {
      type: getSelectedRadioValue(doc, "care-type"),
      hours: validateNumberField(
        doc.getElementById("care-hours"),
        refs.careHoursError
      ),
    },
  };
}

/** Входные данные для активной услуги (подмножество state) */
function inputForCategory(state) {
  if (state.category === "cleaning") {
    return state.cleaning;
  }
  if (state.category === "repair") {
    return state.repair;
  }
  if (state.category === "care") {
    return state.care;
  }
  return {};
}

/** Показать нужную панель и строку «площадь» только для варианта area */
function updatePanels(doc, refs, state) {
  refs.panelCleaning.className =
    state.category === "cleaning" ? "" : "hidden";
  refs.panelRepair.className = state.category === "repair" ? "" : "hidden";
  refs.panelCare.className = state.category === "care" ? "" : "hidden";

  var showCleaningArea =
    state.category === "cleaning" && state.cleaning.type === "area";
  refs.cleaningAreaRow.className = showCleaningArea ? "row" : "row hidden";
  if (!showCleaningArea) {
    clearFieldError(doc.getElementById("cleaning-sqm"), refs.cleaningSqmError);
  }

  var showRepairArea =
    state.category === "repair" && state.repair.type === "area";
  refs.repairAreaRow.className = showRepairArea ? "row" : "row hidden";
  if (!showRepairArea) {
    clearFieldError(doc.getElementById("repair-sqm"), refs.repairSqmError);
  }

  if (state.category !== "care") {
    clearFieldError(doc.getElementById("care-hours"), refs.careHoursError);
  }
}

/** Вывод итога на экран (целые рубли) */
function renderTotal(refs, tripRub, serviceLabel, serviceRub) {
  var total = tripRub + serviceRub;
  refs.totalSumEl.textContent = total.toLocaleString("ru-RU") + " ₽";
  refs.breakdownEl.textContent =
    "Выезд: " +
    tripRub.toLocaleString("ru-RU") +
    " ₽ + " +
    serviceLabel +
    ": " +
    serviceRub.toLocaleString("ru-RU") +
    " ₽";
}

/*
 * Главный пересчёт:
 * 1) читаем форму → state
 * 2) обновляем видимость панелей
 * 3) calculateServiceCost(service, prices, input)
 * 4) прибавляем выезд и рисуем сумму
 */
function recalculate(doc, refs, services, prices) {
  var state = readFormState(doc, refs);
  updatePanels(doc, refs, state);

  var service = services[state.category];
  if (!service) {
    renderTotal(refs, prices.trip, "—", 0);
    return;
  }

  var input = inputForCategory(state);
  var serviceRub = calculateServiceCost(service, prices, input);
  renderTotal(refs, prices.trip, service.label, serviceRub);
}

function bindEvents(doc, refs, services, prices) {
  function onAnyChange() {
    recalculate(doc, refs, services, prices);
  }

  var inputs = doc.querySelectorAll("input");
  var i;
  for (i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener("change", onAnyChange);
    inputs[i].addEventListener("input", onAnyChange);
  }
}

/** Точка входа: собираем ссылки на DOM и запускаем первый расчёт */
function initCalculator(doc) {
  var refs = {
    panelCleaning: doc.getElementById("panel-cleaning"),
    panelRepair: doc.getElementById("panel-repair"),
    panelCare: doc.getElementById("panel-care"),
    cleaningAreaRow: doc.getElementById("cleaning-area-row"),
    repairAreaRow: doc.getElementById("repair-area-row"),
    totalSumEl: doc.getElementById("total-sum"),
    breakdownEl: doc.getElementById("breakdown"),
    cleaningSqmError: doc.getElementById("cleaning-sqm-error"),
    repairSqmError: doc.getElementById("repair-sqm-error"),
    careHoursError: doc.getElementById("care-hours-error"),
  };

  var services = createServices();
  bindEvents(doc, refs, services, PRICES);
  recalculate(doc, refs, services, PRICES);
}

initCalculator(document);
