import DataSet from '@antv/data-set';
import { Chart } from '@antv/g2';

fetch('https://gw.alipayobjects.com/os/antvdemo/assets/data/usa.geo.json')
  .then(res => res.json())
  .then(GeoJSON => {
    const userData = [];
    const geoDv = new DataSet.View().source(GeoJSON, {
      type: 'GeoJSON'
    }).transform({
      type: 'map',
      callback(row) {
        userData.push({
          longitude: row.centroidX,
          latitude: row.centroidY,
          name: row.name,
          value: Math.random() * (1000 - 1)
        });
        return row;
      }
    });

    const chart = new Chart({
      container: 'container',
      autoFit: true,
      height: 500,
      padding: 0
    });
    chart.scale({
      latitude: { sync: true },
      longitude: { sync: true }
    });
    chart.legend(false);
    chart.axis(false);
    chart.tooltip(false);

    const geoView = chart.createView();
    geoView.data(geoDv.rows);
    geoView.polygon()
      .position('longitude*latitude')
      .color('grey')
      .label('name', {
        offset: 0
      });

    const userView = chart.createView();
    userView.data(userData);
    userView.heatmap()
      .position('longitude*latitude')
      .color('value', '#F51D27-#FA541C-#FF8C12-#FFC838-#FAFFA8-#80FF73-#12CCCC-#1890FF-#6E32C2')
      .size(500 / 20)
      .style({
        blur: 500 / 15
      });
    chart.render();
  });
