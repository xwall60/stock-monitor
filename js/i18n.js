const translations = {
  zh: {
    title: "股价监控",
    add_stock: "添加股票",
    code_value: "代码/市值",
    price_cost: "现价/成本",
    change: "涨跌%",
    position_profit: "持仓/盈亏",
    actions: "操作",
    edit: "编辑",
    delete: "删除",
    code: "代码",
    cost: "成本价",
    position: "持仓",
    submit: "提交",
    edit_stock: "编辑股票"
  },
  en: {
    title: "Stock Monitor",
    add_stock: "Add Stock",
    code_value: "Code/Value",
    price_cost: "Price/Cost",
    change: "Change %",
    position_profit: "Position/Profit",
    actions: "Actions",
    edit: "Edit",
    delete: "Delete",
    code: "Code",
    cost: "Cost",
    position: "Position",
    submit: "Submit",
    edit_stock: "Edit Stock"
  }
};

function getText(key) {
  const lang = localStorage.getItem('lang') || 'zh';
  return translations[lang][key] || key;
}

function applyI18n() {
  const lang = localStorage.getItem('lang') || 'zh';
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.innerText = translations[lang][key] || key;
  });
}
