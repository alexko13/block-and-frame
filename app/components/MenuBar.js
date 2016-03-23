import React from 'react';
import { Link } from 'react-router';
import authHelpers from '../utils/authHelpers';

const MenuBar = () => {
  return (
  <div className="ui attached stackable menu">

    <Link
      className="item"
      to={'/events'}
    >
      <i className="big world icon"></i>
      <b>
        Spread Out
      </b>
    </Link>
    <Link
      className="item"
      to={'/events'}
    >
        <i className="users icon"></i>
        View Spreads
    </Link>
    <Link
      className="item"
      to={'/eventcreate'}
    >
      <i className="spoon icon"></i>
      Host A Spread
    </Link>
    <div className="ui simple dropdown right vertical item">
      <Link to={'/profile'}>
        My Account
      </Link>
      <i className="dropdown icon"></i>
      <div className="menu">
        <Link
          className="item"
          to={'/editprofile'}
        >
            <i className="edit icon"></i>
            Edit Profile
        </Link>
        <a className="item"><i className="food icon"></i> My Spreads</a>
        <a className="item"><i className="mail icon"></i> Messages</a>
        <a className="item"><i className="settings icon"></i> Account Settings</a>
        <Link
          className="item"
          to={'/signin'}
          onClick={authHelpers.logout}
        >
          <i className="sign out icon"></i>
           Log Out
        </Link>
      </div>
  </div>
</div>
  );
};

export default MenuBar;
