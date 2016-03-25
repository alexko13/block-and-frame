import React from 'react';
import update from 'react-addons-update';
import eventHelpers from '../utils/eventHelpers';
import UniqueEventEdit from '../components/events/UniqueEventEdit';
import UniqueEventView from '../components/events/UniqueEventView';
import MenuBar from '../components/MenuBar';
import MapView from '../components/events/MapView';
import ContributionList from '../components/events/ContributionList';

class UniqueEvent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      eventName: '',
      description: '',
      location: '',
      time: '',
      date: '',
      eventId: '',
      creator_name: '',
      creator_email: '',
      showEdit: false,
      editable: false,
      markers: [],
      url: location.href.split('/').pop(),
      creatorId: '',
      msgDivClass: 'warning',
      coordinates: '',
    };

    this.setEdit = this.setEdit.bind(this);
    this.initializePage = this.initializePage.bind(this);
    this.editState = this.editState.bind(this);
    this.determineName = this.determineName.bind(this);
    this.saveEventChanges = this.saveEventChanges.bind(this);
    this.handleMapClick = this.handleMapClick.bind(this);
    this.handleMarkerRightClick = this.handleMarkerRightClick.bind(this);
    this.handleCheckBoxClick = this.handleCheckBoxClick.bind(this);
    this.handleJoinEventWithContributions = this.handleJoinEventWithContributions.bind(this);
    this.loadMarker = this.loadMarker.bind(this);
  }

  componentDidMount() {
    this.initializePage();
  }

  setEdit() {
    if (this.state.showEdit) {
      this.saveEventChanges();
    }

    this.setState({ showEdit: !this.state.showEdit });
  }

  handleCheckBoxClick(e, index) {
    // toggle 'bringer' to be user id or null 
    if (this.state.contributions[index].bringer === null) {
      this.state.contributions[index].bringer = window.localStorage.id;
    } else {
      this.state.contributions[index].bringer = null;
    }
    console.log(this.state.contributions[index]); 
  }

  handleJoinEventWithContributions(eventId, contribs) {
    this.setState({ msgDivClass: 'positive' });
    eventHelpers.joinEventWithContributions(eventId, contribs);
  }

  initializePage() {
    eventHelpers.getEventbyId(this.state.url)
      .then((response) => {
        console.log('response from init page', response.data);
        response.data.users.forEach((user) => {
          if (user._pivot_user_id === Number(window.localStorage.id)) {
            this.setState({ creatorId: user._pivot_user_id });
          }
        });
        this.setState({
          eventName: response.data.name,
          description: response.data.description,
          location: response.data.location,
          date: response.data.date,
          time: response.data.time,
          eventId: response.data.id,
          creator_email: response.data.users[0].email,
          creator_name: response.data.users[0].username,
          contributions: response.data.toBring.contributions,
          coordinates: response.data.coordinates,
        });
        // if (this.state.creatorId === Number(window.localStorage.id)) {
        //   this.setState({ editable: true });
        // here
        if (this.state.creator_email === sessionStorage.email) {
          this.setState({ editable: true });
        }
        console.log('outer', this.state.coordinates);
      })
      .catch((error) => {
        console.log(error);
      });
    setTimeout(this.loadMarker, 2000);
    console.log('STATE', this.state);
  }

  editState(e) {
    this.setState({ [e.target.className]: e.target.value });
  }

  determineName() {
    if (!this.state.creator_name) {
      return this.state.creator_email;
    }
    return this.state.creator_name;
  }

  // TODO: add toBring and coordinates here as well
  saveEventChanges() {
    console.log('saveEventChanges');

    const edits = ({
      name: this.state.eventName,
      location: this.state.location,
      description: this.state.description,
    });

    eventHelpers.editEvent(this.state.url, edits);
  }

  // adds markers to map when map is left clicked
  loadMarker() {
    const location = {};
    const coordinates = this.state.coordinates;
    let { markers } = this.state;
    if (this.state.markers.length === 1) {
      return;
    }
    const latitude = coordinates.split(',').shift();
    const longitude = coordinates.split(',').pop();
    location.lat = Number(latitude);
    location.lng = Number(longitude);
    console.log('LOCATION', location);
    markers = update(markers, {
      $push: [
        {
          position: location,
          defaultAnimation: 2,
          key: Date.now(),
        },
      ],
    });
    this.setState({ markers });
  }

  handleMapClick() {
    return;
  }

  // removes marker from map when marker is right clicked
  handleMarkerRightClick(index, event) {
    console.log('here in rightclick', event);
    let { markers } = this.state;
    console.log('here');
    markers = update(markers, {
      $splice: [
        [index, 1],
      ],
    });
    this.setState({ markers });
  }


  render() {
    console.log('creatorId!!', this.state.creatorId);
    this.state.contributions = this.state.contributions || [];
    return (
    <div>
      <MenuBar />
      <br />
      <div className="ui two column stackable grid container">
        <div className="sixteen wide column"><br /></div>
          <div className="five wide column">
            {/* TODO: reuse UserInfo component here */}
            <div className="ui very padded raised segment card">
              <div className="ui image ">
                <img className="ui tiny circular right floated image" src="http://www.geekstogo.com/forum/public/style_images/shift/profile/xdefault_large.png.pagespeed.ic.-RW8oDYs8z.png" />
              </div>
              <div className="ui header">
                Hosted by {this.determineName()}
              </div>
              <p>Host profile info here</p>
            </div>
            <MapView 
              markers={this.state.markers}
              handleMapClick={this.handleMapClick}
              handleMarkerRightClick={this.handleMarkerRightClick}
            />
          </div>
          <div className="ten wide column">
            <div className="ui segment">
              {this.state.showEdit ?
                <UniqueEventEdit
                  eventName={this.state.eventName}
                  description={this.state.description}
                  location={this.state.location}
                  editState={this.editState}
                  setEdit={this.setEdit}
                />
                 :
                <UniqueEventView
                  eventId={this.state.url}
                  eventName={this.state.eventName}
                  description={this.state.description}
                  location={this.state.location}
                  date={this.state.date}
                  time={this.state.time}
                  contributions={this.state.contributions}
                  setEdit={this.setEdit}
                  sameEmail={this.state.editable}
                  handleJoinEventWithContributions={this.handleJoinEventWithContributions}
                />
              }
            </div>

            <ContributionList
              msgDivClass={this.state.msgDivClass}
              contributions={this.state.contributions}
              onCheckBoxClick={this.handleCheckBoxClick}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default UniqueEvent;
