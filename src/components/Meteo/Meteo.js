import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import Table, { TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';

import MeteoIcon from './MeteoIcon';
import style from './Meteo.less';

export default class Meteo extends Component {

  static propTypes = {
    data: PropTypes.shape({
      city_info: PropTypes.shape({
        country: PropTypes.string,
        name: PropTypes.string,
        sunrise: PropTypes.string,
        sunset: PropTypes.string,
      }).isRequired,
      fcst_day_0: PropTypes.shape({
        day_long: PropTypes.string,
        hourly_data: PropTypes.shape({
        }),
      }),
    }).isRequired,
    hour: PropTypes.string.isRequired,
    selectedDay: PropTypes.string.isRequired,
  };

  state = {
  };

  svgConfig = {
  };

  render() {
    const result = this.props.data;
    console.debug('Meteo props', this.props);
    const dayField = `fcst_day_${this.props.selectedDay}`;
    const day = result[dayField];
    const hourlyResult = day.hourly_data[this.props.hour];
    console.debug('hourlyResult', hourlyResult);

    const temperatureText = `Température de ${hourlyResult.TMP2m}C°`;

    let precipitation = '';
    let snowEnable = false;
    let rainEnable = false;
    if (hourlyResult.APCPsfc > 0) {
      let type = 'pluie';
      if (hourlyResult.ISSNOW) {
        type = 'neige';
        snowEnable = true;
      } else {
        rainEnable = true;
      }

      precipitation = (
        <TableRow>
          <TableRowColumn>
            Précipitation {hourlyResult.APCPsfc} mm/H de {type}
          </TableRowColumn>
        </TableRow>
      );
    }

    const windText = (
      <p>Vent de {hourlyResult.WNDSPD10m} Km/H</p>
    );
    let windEnable = false;
    if (hourlyResult.WNDSPD10m > 20) {
      windEnable = true;
    }

    let stormEnable = false;
    if (/orage/.test(hourlyResult.CONDITION)) {
      stormEnable = true;
    }

    let sunnyEnable = false;
    if (/Eclaircie|Stratus|/.test(hourlyResult.CONDITION)) {
      sunnyEnable = true;
    }

    let sunEnable = false;
    let cloudEnable = false;
    if (rainEnable || stormEnable || snowEnable || /nuageux|Couvert/.test(hourlyResult.CONDITION) || sunnyEnable) {
      cloudEnable = true;
    } else {
      sunEnable = true;
    }

    const sunrise = moment(this.props.hour.split('H')[0], 'HH').diff(moment(result.city_info.sunrise, 'HH:mm'), 'minutes');
    const sunset = moment(this.props.hour.split('H')[0], 'HH').diff(moment(result.city_info.sunset, 'HH:mm'), 'minutes');
    let night = false;
    if (sunrise < 0 || sunset > 0) {
      night = true;
    }

    this.svgConfig = {
      stormEnable,
      windEnable,
      rainEnable,
      snowEnable,
      sunnyEnable,
      sunEnable,
      cloudEnable,
      night,
    };

    // const result = this.props.data;
    return (
      <div>
        <h2 className={style.title}>Information Meteo pour {this.props.data.city_info.name} à {this.props.hour.split('H')[0]}H</h2>
        <div className={style.info_container}>
          <Table>
            <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
              <TableRow>
                <TableHeaderColumn>Condition</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false}>
              <TableRow>
                <TableRowColumn>
                  {temperatureText}
                </TableRowColumn>
              </TableRow>
              <TableRow>
                <TableRowColumn>
                  {windText}
                </TableRowColumn>
              </TableRow>
              {precipitation}
            </TableBody>
          </Table>
        </div>
        <MeteoIcon className={style.icon_container} svgConfig={this.svgConfig} />
      </div>
    );
  }
}
