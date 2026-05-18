/*
 * Калькулятор услуг V2 — логика в отдельном файле.
 * Тарифы, расчёт и UI связаны через параметры (без глобальных DOM-переменных).
 */

/** Ключ в localStorage — по нему браузер находит сохранённые настройки */
var STORAGE_KEY = "serviceCalculatorState";

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

/** Включить радиокнопку с нужным value в группе name */
function setRadioByName(doc, groupName, value) {
  var list = doc.querySelectorAll('input[name="' + groupName + '"]');
  var i;
  var found = false;
  for (i = 0; i < list.length; i++) {
    if (list[i].value === value) {
      list[i].checked = true;
      found = true;
    }
  }
  return found;
}

/**
 * Читаем JSON из localStorage (после перезагрузки страницы).
 * Если данных нет или они повреждены — возвращаем null.
 */
function loadStateFromLocalStorage() {
  try {
    var raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw);
  } catch (err) {
    return null;
  }
}

/**
 * Записываем в localStorage выбор услуги, поля и итог.
 * Вызывается после каждого пересчёта.
 */
function saveStateToLocalStorage(state, totalRub, tripRub, serviceRub, serviceLabel) {
  var payload = {
    category: state.category,
    cleaning: {
      type: state.cleaning.type,
      sqm: state.cleaning.sqm,
    },
    repair: {
      type: state.repair.type,
      sqm: state.repair.sqm,
      demolition: state.repair.demolition,
      garbage: state.repair.garbage,
    },
    care: {
      type: state.care.type,
      hours: state.care.hours,
    },
    totalRub: totalRub,
    tripRub: tripRub,
    serviceRub: serviceRub,
    serviceLabel: serviceLabel,
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (err) {
    /* Память недоступна (режим инкогнито и т.п.) — калькулятор всё равно работает */
  }
}

/**
 * Восстанавливаем форму из сохранённого объекта (до первого пересчёта).
 * Возвращает true, если данные применились.
 */
function applyFormState(doc, saved) {
  if (!saved || !saved.category) {
    return false;
  }

  if (!setRadioByName(doc, "category", saved.category)) {
    return false;
  }

  if (saved.cleaning) {
    setRadioByName(doc, "cleaning-type", saved.cleaning.type || "full");
    if (saved.cleaning.sqm !== undefined && saved.cleaning.sqm !== null) {
      doc.getElementById("cleaning-sqm").value = saved.cleaning.sqm;
    }
  }

  if (saved.repair) {
    setRadioByName(doc, "repair-type", saved.repair.type || "full");
    if (saved.repair.sqm !== undefined && saved.repair.sqm !== null) {
      doc.getElementById("repair-sqm").value = saved.repair.sqm;
    }
    doc.getElementById("repair-demolition").checked = !!saved.repair.demolition;
    doc.getElementById("repair-garbage").checked = !!saved.repair.garbage;
  }

  if (saved.care) {
    setRadioByName(doc, "care-type", saved.care.type || "elderly");
    if (saved.care.hours !== undefined && saved.care.hours !== null) {
      doc.getElementById("care-hours").value = saved.care.hours;
    }
  }

  return true;
}

/** Быстро показать сохранённый итог, пока идёт полный пересчёт (опционально при загрузке) */
function renderSavedTotal(refs, saved) {
  if (saved.totalRub === undefined || saved.totalRub === null) {
    return;
  }
  refs.totalSumEl.textContent =
    Number(saved.totalRub).toLocaleString("ru-RU") + " ₽";
  if (saved.tripRub !== undefined && saved.serviceLabel) {
    refs.breakdownEl.textContent =
      "Выезд: " +
      Number(saved.tripRub).toLocaleString("ru-RU") +
      " ₽ + " +
      saved.serviceLabel +
      ": " +
      Number(saved.serviceRub || 0).toLocaleString("ru-RU") +
      " ₽";
  }
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
    saveStateToLocalStorage(state, prices.trip, prices.trip, 0, "—");
    return;
  }

  var input = inputForCategory(state);
  var serviceRub = calculateServiceCost(service, prices, input);
  var totalRub = prices.trip + serviceRub;

  renderTotal(refs, prices.trip, service.label, serviceRub);

  /* Сохраняем всё, что видит пользователь, чтобы после F5 ничего не потерялось */
  saveStateToLocalStorage(
    state,
    totalRub,
    prices.trip,
    serviceRub,
    service.label
  );
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

  /* 1) подставляем сохранённые поля; 2) пересчитываем и снова пишем в localStorage */
  var saved = loadStateFromLocalStorage();
  if (saved) {
    applyFormState(doc, saved);
    renderSavedTotal(refs, saved);
  }

  recalculate(doc, refs, services, PRICES);
}

initCalculator(document);
