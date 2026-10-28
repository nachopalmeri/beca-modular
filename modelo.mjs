import { financial, scenarios } from './model.mjs';

const $ = selector => document.querySelector(selector);
const form = $('#business-assumptions');
const money = value => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
const count = value => new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 }).format(value);
const presetLabels = { conservative: 'Escenario conservador · hipotético', base: 'Escenario base · hipotético', optimistic: 'Escenario optimista · hipotético' };

function assumptionsFromForm() {
  return Object.fromEntries([...form.elements].filter(element => element.name).map(element => [element.name, element.valueAsNumber]));
}

function render() {
  if (!form.checkValidity()) {
    $('#model-error').hidden = false;
    return;
  }
  try {
    const assumptions = assumptionsFromForm();
    const result = financial(assumptions);
    $('#model-error').hidden = true;
    $('#operating-result').textContent = `${result.result < 0 ? '−' : ''}${money(Math.abs(result.result))}`;
    $('#operating-result').className = result.result < 0 ? 'is-loss' : 'is-profit';
    $('#result-caption').textContent = result.result < 0
      ? `Pérdida mensual proyectada bajo estos supuestos. No se compensa con el principal educativo.`
      : result.result > 0
        ? 'Resultado operativo positivo proyectado bajo estos supuestos; todavía no es un resultado real.'
        : 'Punto de equilibrio exacto bajo estos supuestos; todavía no es un resultado real.';
    $('#kpi-seats').textContent = count(result.learners);
    $('#kpi-principal').textContent = money(result.allocated);
    $('#kpi-payouts').textContent = money(result.payouts);
    $('#kpi-revenue').textContent = money(result.revenue);
    $('#kpi-costs').textContent = money(result.cogs);
    $('#kpi-fixed').textContent = money(result.fixed);
    $('#bar-principal-label').textContent = money(result.allocated);
    $('#bar-revenue-label').textContent = money(result.revenue);
    $('#break-even-title').textContent = result.breakEven === null
      ? 'Punto de equilibrio no alcanzable con el margen actual.'
      : `${count(result.breakEven)} sponsors para cubrir costos con la licencia actual.`;
    const requiredLicense = assumptions.sponsors > 0
      ? assumptions.fixed / assumptions.sponsors + assumptions.students * (assumptions.infra + assumptions.ai + assumptions.support) + assumptions.students * assumptions.budget * assumptions.utilization / 100 * (assumptions.paymentRate - assumptions.fee) / 100
      : null;
    $('#required-license').textContent = requiredLicense === null ? 'no calculable sin sponsors' : money(Math.max(0, requiredLicense));
    $('#model-status').textContent = `Actualizado: ${count(result.learners)} cupos; ingreso de plataforma ${money(result.revenue)}; resultado operativo ${money(result.result)} al mes. Todo es proyección.`;
  } catch {
    $('#model-error').hidden = false;
  }
}

function applyPreset(name) {
  for (const [key, value] of Object.entries(scenarios[name])) form.elements.namedItem(key).value = value;
  document.querySelectorAll('[data-preset]').forEach(button => {
    const selected = button.dataset.preset === name;
    button.classList.toggle('active', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
  $('#preset-label').textContent = presetLabels[name];
  render();
}

document.querySelectorAll('[data-preset]').forEach(button => button.addEventListener('click', () => applyPreset(button.dataset.preset)));
form.addEventListener('submit', event => event.preventDefault());
form.addEventListener('input', () => {
  document.querySelectorAll('[data-preset]').forEach(button => {
    button.classList.remove('active');
    button.setAttribute('aria-pressed', 'false');
  });
  $('#preset-label').textContent = 'Supuestos personalizados · hipotéticos';
  render();
});
applyPreset('base');
