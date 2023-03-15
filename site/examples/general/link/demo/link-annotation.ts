/**
 * A recreation of this demo: https://observablehq.com/@observablehq/plot-link?collection=@observablehq/plot
 */
import { Chart } from '@antv/g2';

const income = [
  {
    type: 'All workers',
    m: 57791,
    f: 41518,
    age: 'total',
  },
  {
    type: 'Less than 9th grade',
    m: 26789,
    f: 20499,
    age: 'total',
  },
  {
    type: '9th to 12th grade (no diploma)',
    m: 31434,
    f: 23351,
    age: 'total',
  },
  {
    type: 'High school graduate',
    m: 42466,
    f: 29410,
    age: 'total',
  },
  {
    type: 'Some college, no degree',
    m: 48431,
    f: 35916,
    age: 'total',
  },
  {
    type: 'Associate’s degree',
    m: 51485,
    f: 40463,
    age: 'total',
  },
  {
    type: 'Bachelor’s degree or more',
    m: 88843,
    f: 59052,
    age: 'total',
  },
  {
    type: 'All workers',
    m: 26170,
    f: 23462,
    age: '18 to 24 years old',
  },
  {
    type: 'Less than 9th grade',
    m: 19361,
    f: null,
    age: '18 to 24 years old',
  },
  {
    type: '9th to 12th grade (no diploma)',
    m: 20918,
    f: 17514,
    age: '18 to 24 years old',
  },
  {
    type: 'High school graduate',
    m: 24974,
    f: 20427,
    age: '18 to 24 years old',
  },
  {
    type: 'Some college, no degree',
    m: 26957,
    f: 21822,
    age: '18 to 24 years old',
  },
  {
    type: 'Associate’s degree',
    m: 29698,
    f: 26638,
    age: '18 to 24 years old',
  },
  {
    type: 'Bachelor’s degree or more',
    m: 38275,
    f: 32865,
    age: '18 to 24 years old',
  },
  {
    type: 'All workers',
    m: 46181,
    f: 38581,
    age: '25 to 34 years old',
  },
  {
    type: 'Less than 9th grade',
    m: 23453,
    f: 18180,
    age: '25 to 34 years old',
  },
  {
    type: '9th to 12th grade (no diploma)',
    m: 29347,
    f: 21955,
    age: '25 to 34 years old',
  },
  {
    type: 'High school graduate',
    m: 37181,
    f: 26299,
    age: '25 to 34 years old',
  },
  {
    type: 'Some college, no degree',
    m: 41073,
    f: 32853,
    age: '25 to 34 years old',
  },
  {
    type: 'Associate’s degree',
    m: 42357,
    f: 38857,
    age: '25 to 34 years old',
  },
  {
    type: 'Bachelor’s degree or more',
    m: 67195,
    f: 50341,
    age: '25 to 34 years old',
  },
  {
    type: 'All workers',
    m: 63247,
    f: 44183,
    age: '35 to 44 years old',
  },
  {
    type: 'Less than 9th grade',
    m: 29302,
    f: 21152,
    age: '35 to 44 years old',
  },
  {
    type: '9th to 12th grade (no diploma)',
    m: 31018,
    f: 24637,
    age: '35 to 44 years old',
  },
  {
    type: 'High school graduate',
    m: 45316,
    f: 30769,
    age: '35 to 44 years old',
  },
  {
    type: 'Some college, no degree',
    m: 53080,
    f: 37323,
    age: '35 to 44 years old',
  },
  {
    type: 'Associate’s degree',
    m: 58759,
    f: 41892,
    age: '35 to 44 years old',
  },
  {
    type: 'Bachelor’s degree or more',
    m: 95002,
    f: 63427,
    age: '35 to 44 years old',
  },
  {
    type: 'All workers',
    m: 67635,
    f: 45332,
    age: '45 to 54 years old',
  },
  {
    type: 'Less than 9th grade',
    m: 28988,
    f: 21633,
    age: '45 to 54 years old',
  },
  {
    type: '9th to 12th grade (no diploma)',
    m: 35615,
    f: 24304,
    age: '45 to 54 years old',
  },
  {
    type: 'High school graduate',
    m: 49199,
    f: 31984,
    age: '45 to 54 years old',
  },
  {
    type: 'Some college, no degree',
    m: 56320,
    f: 39785,
    age: '45 to 54 years old',
  },
  {
    type: 'Associate’s degree',
    m: 57363,
    f: 44191,
    age: '45 to 54 years old',
  },
  {
    type: 'Bachelor’s degree or more',
    m: 101763,
    f: 65001,
    age: '45 to 54 years old',
  },
  {
    type: 'All workers',
    m: 65956,
    f: 43870,
    age: '55 to 64 years old',
  },
  {
    type: 'Less than 9th grade',
    m: 29913,
    f: 19681,
    age: '55 to 64 years old',
  },
  {
    type: '9th to 12th grade (no diploma)',
    m: 41136,
    f: 25078,
    age: '55 to 64 years old',
  },
  {
    type: 'High school graduate',
    m: 47741,
    f: 31015,
    age: '55 to 64 years old',
  },
  {
    type: 'Some college, no degree',
    m: 56120,
    f: 40749,
    age: '55 to 64 years old',
  },
  {
    type: 'Associate’s degree',
    m: 51978,
    f: 39477,
    age: '55 to 64 years old',
  },
  {
    type: 'Bachelor’s degree or more',
    m: 92223,
    f: 64054,
    age: '55 to 64 years old',
  },
  {
    type: 'All workers',
    m: 58565,
    f: 38629,
    age: '65 years old and over',
  },
  {
    type: 'Less than 9th grade',
    m: 26062,
    f: null,
    age: '65 years old and over',
  },
  {
    type: '9th to 12th grade (no diploma)',
    m: 32810,
    f: 27948,
    age: '65 years old and over',
  },
  {
    type: 'High school graduate',
    m: 42766,
    f: 29170,
    age: '65 years old and over',
  },
  {
    type: 'Some college, no degree',
    m: 51091,
    f: 43082,
    age: '65 years old and over',
  },
  {
    type: 'Associate’s degree',
    m: 48347,
    f: 37079,
    age: '65 years old and over',
  },
  {
    type: 'Bachelor’s degree or more',
    m: 85106,
    f: 58288,
    age: '65 years old and over',
  },
];

const incdomain = (() => {
  const elements = []
    .concat(
      income.map((v) => v.m),
      income.map((v) => v.f),
    )
    .filter((v) => typeof v === 'number');

  return [Math.min(...elements), Math.max(...elements)];
})();

const chart = new Chart({
  container: 'container',
  theme: 'classic',
  autoFit: true,
  paddingLeft: 50,
  paddingRight: 50,
});

chart
  .link()
  .data([1])
  .encode('x', [() => incdomain[0], () => incdomain[1]])
  .encode('y', [() => incdomain[0], () => incdomain[1]])
  .tooltip(false)
  .label({
    position: 'top-right',
    text: (v) => `${v * 100}%`,
    style: {
      dx: 4,
      textAlign: 'start',
      textBaseline: 'middle',
    },
  })
  .style('stroke', '#000');

chart
  .link()
  .data([0.6, 0.7, 0.8, 0.9])
  .encode('x', [() => incdomain[0], () => incdomain[1]])
  .encode('y', [(v) => v * incdomain[0], (v) => v * incdomain[1]])
  .tooltip(false)
  .label({
    position: 'top-right',
    text: (v) => `${v * 100}%`,
    style: {
      dx: 4,
      textAlign: 'start',
      textBaseline: 'middle',
    },
  })
  .style('stroke', '#000')
  .style('opacity', 0.2);

chart
  .point()
  .data(income)
  .encode('x', 'm')
  .encode('y', 'f')
  .encode('size', 4)
  .encode('shape', 'hollow')
  .style('stroke', '#000');

chart.render();
