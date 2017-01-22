import React, { Component, PropTypes } from 'react';

// import style from './app.css';

export default class TransportEvent extends Component {

  static propTypes = {
    data: PropTypes.shape({
      connections: PropTypes.shape({
        from: PropTypes.shape({
          departure: PropTypes.string,
          platfrom: PropTypes.string,
        }),
        duration: PropTypes.string,
        products_count: PropTypes.string,
      }),
    }),
  };

  state = {
  };

  render() {
    return (
      <div className="transport-event">
        <p>Event</p>
      </div>
    );
  }
}
