import React, { Component } from 'react';
import $ from 'jquery';
import moment from 'moment';

import TransportForm from './TransportForm';
import TransportConnection from './TransportConnection';
import TransportEvent from './TransportEvent';
import Meteo from '../Meteo';
import listCities from './list-cities.json';

import style from './Transport.less';

export default class Transport extends Component {
  constructor() {
    super();

    this.handlerUpdate = this.handlerUpdate.bind(this);
  }
  state = {
    from: '',
    to: '',
    via: '',
    datetime: '',
    transport_api: null,
    meteo_api: null,
    event_api: null,
  };

  getTransportConnection(data) {
    $.get('http://transport.opendata.ch/v1/connections',
      {
        to: data.to,
        from: data.from,
        date: moment(data.datetime).format('YYYY-MM-D'),
        time: moment(data.datetime).format('HH:mm'),
        limit: 4, // limit number of result (1-6)
        page: 0, // Default page used for next/prev button
      }).then((d) => {
        console.debug('Data from Transport API', d);
        d.connections.map((c) => {
          c.duration = moment(c.duration, 'd-HH-mm-ss').format('HH:mm');
          c.from.departure = moment(c.from.departure).format('D-MM-YYYY HH:mm');
          c.products_count = c.products.length;

          return true;
        });
        if (d.connections.length > 0) {
          this.setState({ meteo_api_hour: `${moment(d.connections[0].to.arrival).format('H')}H00` });

          this.setState({ transport_api: d, transport_api_error: false });
        } else {
          this.setState({ transport_api_message: '0 Connexion trouvé !', transport_api_error: true });
        }
      }).catch((e) => {
        console.error(e.responseJSON.errors[0].message);
        this.setState({ transport_api_message: `Transport-api Error: ${e.status} - ${e.statusText}`, transport_api_error: true });
      });
  }

  getMeteoPrevision(data) {
    const selectedDay = moment(data.datetime).diff(moment(), 'days');

    if (selectedDay >= 0 && selectedDay <= 5) {
      $.get(`http://www.prevision-meteo.ch/services/json/${data.to.split(',')[0]}`)
        .then((d) => {
          if (d.errors) {
            console.debug('City not found, research by lat & lng');
            const alternative = [];
            const re = new RegExp(`^${data.to.split(',')[0].toLowerCase()}`);
            $.map(listCities, (obj) => {
              if (re.test(obj.url)) {
                alternative.push(obj.url);
              }
            });

            $.get('http://api.geonames.org/postalCodeSearch', { placename: data.to.split(',')[0], username: 'jzaehrin', type: 'json' })
              .then((coordonate) => {
                console.debug('Geoname datae', coordonate);
                if (coordonate.lenght < 1) {
                  this.setState({
                    message: 'No postal code find for the destination - API Meteo & Event cannot be render',
                    type: 'error',
                    meteo_api_message: `Meteo-api Error: ${coordonate.errors[0].text}. Alternative: ${alternative.join(', ')}`,
                    meteo_api_error: true,
                  });
                } else {
                  const city = coordonate.postalCodes[0];
                  $.get(`http://www.prevision-meteo.ch/services/json/lat=${city.lat}lng=${city.lng}`)
                    .then((r) => {
                      r.city_info.name = data.to.split(',')[0];
                      console.debug('Data from Meteo API', d);
                      this.setState({
                        meteo_api: r,
                        meteo_api_selectedDay: selectedDay.toString(),
                        meteo_api_error: false,
                        meteo_api_precision: `The precision is possibily change because informations are locate with lat & lng. Or the city is wrong,
                                              follow the link for verifiy. Alternative for meteo API : ${alternative.join(', ')}`,
                        // meteo_api_precision_link: `https://www.google.com/maps/preview/@${city.lat},${city.lng},8z`,
                        meteo_api_precision_link: `https://maps.google.com/?q=${city.lat},${city.lng}&ll=${city.lat},${city.lng}&z=6`,
                      });
                    });
                }
              })
              .catch((e) => {
                console.debug('Geoname Error', e);
              });
          } else {
            console.debug('Data from Meteo API', d);
            this.setState({
              meteo_api: d,
              meteo_api_selectedDay: selectedDay.toString(),
              meteo_api_error: false,
              meteo_api_precision: null,
            });
          }
        });
    } else {
      this.setState({ meteo_api_message: 'The days selected was too in the futurs or in the past', meteo_api_error: true });
    }
  }

  handlerUpdate(data) {
    this.setState({
      data,
      transport_api: null,
      meteo_api: null,
      event_api: null,
    });

    console.debug('Data from form', data);

    this.getTransportConnection(data);

    this.getMeteoPrevision(data);

      /*  $.get('http://api.eventful.com/events', { app_key: apiKey, oauth_token: '09e9c011dd5a1ec871e7', oauth_token_secret: 'be16e3ef5357870b4002', location: 'Sion', type: 'json' })
            .then((r) => {
              console.debug('Eventful', r);
            })
            .catch((e) => {
              console.debug('Eventful Error', e);
            }); */
  }

  render() {
    let status = '';
    let connection = '';
    let meteo = '';
    let meteoPrecision = '';

    if (this.state.type && this.state.message) {
      const classString = `alert alert- ${this.state.type}`;
      status = <div id="status" className={classString}>{this.state.message}</div>;
    }

    if (!this.state.transport_api_error && this.state.transport_api) {
      connection = (
        <div className={style.result}>
          <TransportConnection
            data={this.state.transport_api}
          />
        </div>
      );
    } else {
      connection = (
        <div className={style.result}>
          <p className="error" id="transportConnectrion">
            {this.state.transport_api_message}
          </p>
        </div>
      );
    }

    if (!this.state.meteo_api_error && this.state.meteo_api) {
      if (this.state.meteo_api_hour) {
        meteo = (
          <div className={style.result}>
            <Meteo
              data={this.state.meteo_api}
              hour={this.state.meteo_api_hour}
              selectedDay={this.state.meteo_api_selectedDay}
            />
          </div>
        );
      }
    } else {
      meteo = (
        <div className={style.result}>
          <p className="error" id="transportMeteo">
            {this.state.meteo_api_message}
          </p>
        </div>
      );
    }

    if (this.state.meteo_api_precision) {
      meteoPrecision = (
        <div className="Info">
          <p>{this.state.meteo_api_precision}</p>
          <a target="_blank" rel="noopener noreferrer" href={this.state.meteo_api_precision_link}>Google Map</a>
        </div>
      );
    }

    if (false) {
      const event = (<TransportEvent />);
      console.debug(event);
    }

    return (
      <div>
        <div className={`${style.form} ${style.col}`}>
          <TransportForm onSubmit={this.handlerUpdate} />
          {status}
        </div>
        <div className={style.col}>
          {connection}
        </div>
        <div className={style.col}>
          {meteoPrecision}
          {meteo}
        </div>
      </div>
    );
  }
}
