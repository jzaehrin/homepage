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
    /* Test case for config and create weather information */
    const result = this.props.data;
    console.debug('Meteo props', this.props);
    const dayField = `fcst_day_${this.props.selectedDay}`;
    const day = result[dayField];
    const hourlyResult = day.hourly_data[this.props.hour];
    console.debug('hourlyResult', hourlyResult);

    const temperatureText = `Temperature of ${hourlyResult.TMP2m}C°`;

    let precipitation = '';
    let snowEnable = false;
    let rainEnable = false;
    if (hourlyResult.APCPsfc > 0) {
      let type = 'rain';
      if (hourlyResult.ISSNOW) {
        type = 'snow';
        snowEnable = true;
      } else {
        rainEnable = true;
      }

      precipitation = (
        <TableRow>
          <TableRowColumn>
            Precipitation : {hourlyResult.APCPsfc} mm/H of {type}
          </TableRowColumn>
        </TableRow>
      );
    }

    const windText = (
      <p>Wind speed: {hourlyResult.WNDSPD10m} Km/h</p>
    );
    let windEnable = false;
    if (hourlyResult.WNDSPD10m > 20) {
      windEnable = true;
    }

    let stormEnable = false;
    if (/orage/.test(hourlyResult.CONDITION_KEY)) {
      stormEnable = true;
    }

    let sunnyEnable = false;
    if (/eclaircie|stratus/.test(hourlyResult.CONDITION_KEY)) {
      sunnyEnable = true;
    }

    let sunEnable = false;
    let cloudEnable = false;
    if (rainEnable || stormEnable || snowEnable || /nuageux|couvert/.test(hourlyResult.CONDITION_KEY) || sunnyEnable) {
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

    /* group information for MeteoIcon */
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
      <div className={style.container}>
        <h2 className={style.title}>Weather information for {this.props.data.city_info.name} at {this.props.hour.split('H')[0]}H</h2>
        <div className={style.info_container}>
          <Table className={style.table}>
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
        <div className={style.icon_container}>
          {/* Render MeteoIcon */}
          <MeteoIcon svgConfig={this.svgConfig} />
        </div>
      </div>
    );
  }
}
