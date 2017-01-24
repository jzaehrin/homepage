import React, { Component } from 'react';
import $ from 'jquery';
import moment from 'moment';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Popover, { PopoverAnimationVertical } from 'material-ui/Popover';
import AppBar from 'material-ui/AppBar';
import MdError from 'react-icons/md/error';
import MdRefresh from 'react-icons/md/refresh';

import Transport from '../Transport';
import Meteo from '../Meteo';
import style from './App.less';

export default class App extends Component {
  constructor() {
    super();

    this.handleRequestClosing = this.handleRequestClosing.bind(this);
    this.handleRefreshPage = this.handleRefreshPage.bind(this);
  }

  state = {
    pop: true,
  };

  componentWillMount() {
    $.get(`http://www.prevision-meteo.ch/services/json/${this.location}`)
      .then((d) => {
        if (d.errors) {
          console.error(d.errors[0].text);
          this.setState({
            meteo_api_message: `Meteo-api Error: ${d.errors[0].description}`,
            meteo_api_error: true,
          });
        } else {
          console.debug('Data from Meteo API', d);
          this.setState({
            meteo_api: d,
            meteo_api_hour: `${moment().format('H')}H00`,
            meteo_api_selectedDay: '0',
            meteo_api_error: false,
          });
        }
      });
  }

  location = 'Sion-vs';

  handleRequestClosing() {
    this.setState({
      pop: false,
    });
  }

  handleRefreshPage() {
    console.debug(this);
    window.location.reload();
  }

  render() {
    let offlineAlert = '';
    let meteo = '';
    const css = {
      width: 'calc(100% - 40px)',
      marginRight: '20px',
      marginLeft: '20px',
      border: '3px solid #e74c3c',
      backgroundColor: 'rgba(42, 42, 42, 0.9)',

    };

    if (!window.navigator.onLine) {
      offlineAlert = (
        <Popover
          open={this.state.pop}
          anchorEl={document.getElementsByName('body')[0]}
          onRequestClose={this.handleRequestClosing}
          useLayerForClickAway
          animation={PopoverAnimationVertical}
          style={css}
        >
          <div className={style.error}>
            <MdError />
            <div>
              <p>Your navigator is offline. This app require a internet connection.</p>
            </div>
            <MdRefresh onClick={this.handleRefreshPage} />
          </div>
        </Popover>
      );
    }
    if (!this.state.meteo_api_error && this.state.meteo_api) {
      if (this.state.meteo_api_hour) {
        meteo = (
          <Meteo
            data={this.state.meteo_api}
            hour={this.state.meteo_api_hour}
            selectedDay={0}
          />
        );
      }
    } else {
      meteo = (
        <div className="block">
          <p className="error" id="transportMeteo">
            {this.state.meteo_api_message}
          </p>
        </div>
      );
    }

    return (
      <MuiThemeProvider>
        <div>
          <AppBar
            title="Home Page"
            iconElementLeft={<p />}
            style={{ marginBottom: '5px', backgroundColor: '#ecf0f1' }}
            titleStyle={{ color: '3434344' }}
          />
          {offlineAlert}
          <div className={`${style.col} ${style.background}`}>
            {meteo}
          </div>
          <Transport />
        </div>
      </MuiThemeProvider>
    );
  }
}
