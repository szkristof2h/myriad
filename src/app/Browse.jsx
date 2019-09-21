import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Proptypes from "prop-types";
import axios from "axios";
import { ErrorContext } from "./contexts/ErrorContext.jsx";
import { NavigationContext } from "./contexts/NavigationContext.jsx";
import { UserContext } from "./contexts/UserContext.jsx";
import config from "./config";
import {
  Button,
  ButtonError,
  ButtonTransparent
} from "./components/Button.style";
import { Base, Header } from "./Typography/Typography.style";
import StyledBrowse from "./Browse.style";

const siteUrl = config.url;

const Browse = () => {
  const [mounted, setMounted] = useState(true);
  const [channels, setChannels] = useState([
    "movies",
    "games",
    "asia",
    "skyrim",
    "music",
    "offspring",
    "star wars",
    "memes"
  ]);
  const { setErrors } = useContext(ErrorContext);
  const { user } = useContext(UserContext);

  // const getComments = () => {
  //   axios
  //     .get(`${siteUrl}/get/${type === 'post' ? 'comments' : 'message'}/${id}/${ids.length}/20`, 
  //       { cancelToken: source. token })
  //     .then(res => {
  //       if (res.data.errors) setErrors(errors => [...errors, res.data]);
  //       else if (mounted) {
  //         setComments(c => ({ ...c, ...res.data.comments }));
  //         setIds(cIds => [...cIds, ...res.data.ids]);
  //       }
  //     })
  //     .catch(e => !axios.isCancel(e) && setErrors(errors => [...errors, e.response.data]));
  // };

  const Channel = ({ channelName }) => (
    <Link to={`/channels/${channelName}`} className="channel">
      {channelName}
    </Link>
  );

  return (
    <StyledBrowse>
      <Header size={3} centered>
        Browse
      </Header>
      {channels.map(channel => (
        <Channel key={channel} channelName={channel} />
      ))}
      <Button as={Link} to="/sadas" className={"button"}>Create new channel!</Button>
      <Header size={2} centered>
        Trending
      </Header>
      {channels.map(channel => (
        <Channel key={channel} channelName={channel} />
      ))}
      <Header size={2} centered>
        Fresh
      </Header>
      {channels.map(channel => (
        <Channel key={channel} channelName={channel} />
      ))}
    </StyledBrowse>
  );
};

Browse.propTypes = {
  channelName: Proptypes.string.isRequired
};

export default Browse;
