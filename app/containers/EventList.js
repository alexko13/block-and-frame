import React from 'react';
import axios from 'axios';
import Event from './Event';
import MenuBar from '../components/MenuBar';

class EventList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
    };
  }

  componentDidMount() {
    axios.get('/api/events')
      .then((response) => {
        console.log('EVENLISTDATA', response.data)
        this.setState({ data: response.data });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    const eventNodes = this.state.data.map((event) => {
      return (
        <Event
          key={event.id}
          name={event.name}
          location={event.location}
          description={event.description}
          id={event.id}
          creator_name={event.users[0].username}
          creator_email={event.users[0].email}

        >
        .
        </Event>
      );
    });
    return (
      <div>
        <MenuBar />
        <div className="ui segment">
          {eventNodes}
        </div>
      </div>
    );
  }
}

export default EventList;
