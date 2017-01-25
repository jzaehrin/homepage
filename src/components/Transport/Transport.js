import React, { Component } from 'react';
import $ from 'jquery';
import moment from 'moment';
import Popover, { PopoverAnimationVertical } from 'material-ui/Popover';
import MdWarning from 'react-icons/md/warning';
import MdMap from 'react-icons/md/map';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import TransportForm from './TransportForm';
import TransportConnection from './TransportConnection';
// import TransportEvent from './TransportEvent';
import Meteo from '../Meteo';
import listCities from './list-cities.json';
import style from './Transport.less';

export default class Transport extends Component {
  constructor() {
    super();

    this.handlerUpdate = this.handlerUpdate.bind(this);
    this.getMeteoPrevision = this.getMeteoPrevision.bind(this);
    this.getTransportConnection = this.getTransportConnection.bind(this);
    this.handleRequestClosing = this.handleRequestClosing.bind(this);
  }
  state = {
    from: '',
    to: '',
    via: '',
    datetime: '',
    transport_api: null,
    meteo_api: null,
    meteo_api_error: false,
    event_api: null,
    pop: true,
  };

  getTransportConnection(data) {
    if (!data.via) {
      data.via = '';
    }

    /* Send request to Transport API */
    $.get('http://transport.opendata.ch/v1/connections',
      {
        to: data.to,
        from: data.from,
        via: data.via,
        date: moment(data.datetime).format('YYYY-MM-D'),
        time: moment(data.datetime).format('HH:mm'),
        limit: 4, // limit number of result (1-6)
        page: 0, // Default page used for next/prev button
      }).then((d) => {
        console.debug('Data from Transport API', d);
        /* Test if result is not empty */
        if (d.connections.length > 0) {
          d.connections.map((c) => {
            c.duration = moment(c.duration, 'd-HH-mm-ss').format('HH:mm');
            c.from.departure = moment(c.from.departure).format('D-MM-YYYY HH:mm');
            c.products_count = c.products.length;

            return true;
          });

          this.setState({ meteo_api_hour: `${moment(d.connections[0].to.arrival).format('H')}H00` });

          this.setState({ transport_api: d, transport_api_error: false });
        } else {
          this.setState({ transport_api_message: '0 Connexion trouvé !', transport_api_error: true });
        }
      }).catch((e) => {
        /* Catch error from transport API */
        console.error(e.responseJSON.errors[0].message);
        this.setState({ transport_api_message: `Transport-api Error: ${e.status} - ${e.statusText}`, transport_api_error: true });
      });
  }

  getMeteoPrevision(data) {
    const selectedDay = moment(data.datetime).diff(moment(), 'days');

    /* Test if the date is too in the futur or in the past */
    if (selectedDay >= 0 && selectedDay <= 5) {
      /* Send request with the input value */
      $.get(`http://www.prevision-meteo.ch/services/json/${data.to.split(',')[0]}`)
        .then((d) => {
          /* Test if the destination is found */
          if (d.errors) {
            /* Error get Alternative */
            console.debug('City not found, research by lat & lng');
            const alternative = [];
            const re = new RegExp(`^${data.to.split(',')[0].toLowerCase()}`);
            $.map(listCities, (obj) => {
              if (re.test(obj.url)) {
                alternative.push(obj.url);
              }
            });

            /* Try to get lat & lng from Geoname */
            $.get('http://api.geonames.org/postalCodeSearch', { placename: data.to.split(',')[0], username: 'jzaehrin', type: 'json' })
              .then((coordonate) => {
                console.debug('Geoname data', coordonate);
                /* If no result print alternative and error */
                if (coordonate.postalCodes.length < 1) {
                  let message = `Meteo-api Error: ${d.errors[0].text}.`;
                  if (alternative.length > 0) {
                    message = `${message} Alternative: ${alternative.join(', ')}`;
                  }

                  this.setState({
                    meteo_api_message: message,
                    meteo_api_error: true,
                  });
                } else {
                  /* Resend request to meteo API with lat & lng */
                  const city = coordonate.postalCodes[0];
                  $.get(`http://www.prevision-meteo.ch/services/json/lat=${city.lat}lng=${city.lng}`)
                    .then((r) => {
                      /* Add warning for precision */
                      r.city_info.name = data.to.split(',')[0];
                      console.debug('Data from Meteo API', d);
                      this.setState({
                        meteo_api: r,
                        meteo_api_selectedDay: selectedDay.toString(),
                        meteo_api_error: false,
                        pop: true,
                        meteo_api_precision: `The precision is possibily change because informations are locate with lat & lng. Or the city is wrong,
                          follow the link for verifiy.`,
                        meteo_api_precision_alternative: `Alternative for meteo API : ${alternative.join(', ')}`,
                        // meteo_api_precision_link: `https://www.google.com/maps/preview/@${city.lat},${city.lng},8z`,
                        meteo_api_precision_link: `https://maps.google.com/?q=${city.lat},${city.lng}&ll=${city.lat},${city.lng}&z=6`,
                      });
                    });
                }
              });
          } else {
            /* If no error */
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

  handleRequestClosing() {
    this.setState({
      pop: false,
    });
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

      /* Example for get event from eventful API.
       * But not work in direct request, no CORD heard getted
          $.get('http://api.eventful.com/events',
            { app_key: '',
              oauth_token: '09e9c011dd5a1ec871e7',
              oauth_token_secret: 'be16e3ef5357870b4002',
              location: 'Sion',
              type: 'json'
            })
            .then((r) => {
              console.debug('Eventful', r);
            })
            .catch((e) => {
              console.debug('Eventful Error', e);
            }); */
  }

  render() {
    let connection = '';
    let meteo = '';
    let meteoPrecision = '';
    const css = {
      width: 'calc(100% - 40px)',
      marginRight: '20px',
      marginLeft: '20px',
      border: '3px solid #f39c12',
      backgroundColor: 'rgba(42, 42, 42, 0.9)',

    };

    /* Render TransportConnection component */
    if (!this.state.transport_api_error && this.state.transport_api) {
      connection = (
        <div className={style.colRight}>
          <TransportConnection
            data={this.state.transport_api}
          />
        </div>
      );
    } else if (this.state.transport_api_error) { /* render error */
      connection = (
        <div className={`${style.colRight} ${style.error}`}>
          <h1>
            {this.state.transport_api_message}
          </h1>
        </div>
      );
    }

    /* Render Meteo component */
    if (!this.state.meteo_api_error && this.state.meteo_api) {
      if (this.state.meteo_api_hour) {
        /* Add precision */
        if (this.state.meteo_api_precision) {
          meteoPrecision = (
            <Popover
              open={this.state.pop}
              anchorEl={document.getElementsByName('body')[0]}
              onRequestClose={this.handleRequestClosing}
              useLayerForClickAway
              animation={PopoverAnimationVertical}
              style={css}
            >
              <div className={style.warn}>
                <MdWarning />
                <div>
                  <p>{this.state.meteo_api_precision}</p>
                  <p>{this.state.meteo_api_precision_alternative}</p>
                </div>
                <a target="_blank" rel="noopener noreferrer" href={this.state.meteo_api_precision_link}><MdMap /></a>
              </div>
            </Popover>
          );
        }

        meteo = (
          <div className={style.col} >
            {meteoPrecision}
            <Meteo
              ref={(m) => { this.meteo = m; }}
              data={this.state.meteo_api}
              hour={this.state.meteo_api_hour}
              selectedDay={this.state.meteo_api_selectedDay}
            />
          </div>
        );
      }
    } else if (this.state.meteo_api_error) { /* Render error */
      meteo = (
        <div className={`${style.col} ${style.error}`}>
          <h1>
            {this.state.meteo_api_message}
          </h1>
        </div>
      );
    }

      /* Render Event
    if (false) {
      const event = (<TransportEvent />);
      console.debug(event);
    }
    */

    if (connection !== '') {
      connection = (
        <ReactCSSTransitionGroup
          transitionName="block"
          transitionAppear
          transitionAppearTimeout={2000}
          transitionLeave
          transitionLeaveTimeout={2000}
          transitionEnter={false}
        >
          {connection}
        </ReactCSSTransitionGroup>
      );
    }

    if (meteo !== '') {
      meteo = (
        <ReactCSSTransitionGroup
          transitionName="block"
          transitionAppear
          transitionAppearTimeout={2000}
          transitionLeave
          transitionLeaveTimeout={2000}
          transitionEnter={false}
        >
          {meteo}
        </ReactCSSTransitionGroup>
      );

      /* If meteo is too fast */
      if (connection === '') {
        connection = (
          <div className={`${style.colRight} ${style.empty}`} />
        );
      }
    }

    return (
      <div>
        <ReactCSSTransitionGroup
          transitionName="block"
          transitionAppear
          transitionAppearTimeout={2000}
          transitionLeave
          transitionLeaveTimeout={2000}
          transitionEnter={false}
        >
          <div className={`${style.form} ${style.col}`}>
            <TransportForm onSubmit={this.handlerUpdate} />
          </div>
        </ReactCSSTransitionGroup>
        {connection}
        {meteo}
      </div>
    );
  }
}
