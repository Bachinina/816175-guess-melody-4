import React, {PureComponent, createRef} from "react";
import PropTypes from "prop-types";

export default class AudioPlayer extends PureComponent {
  constructor(props) {
    super(props);

    this._audioRef = createRef();

    this.state = {
      proggress: 0,
      isLoading: true,
      isPlaying: props.isPlaying,
    };
  }

  componentDidMount() {
    const {src} = this.props;

    const audio = this._audioRef.current;
    audio.src = src;

    audio.oncanplaythrough = () => this.setState({
      isLoading: false,
    });

    audio.onplay = () => this.setState({
      isPlaying: true,
    });

    audio.onpause = () => this.setState({
      isPlaying: false,
    });

    audio.ontimeupdate = () => this.setState({
      proggress: audio.currentTime,
    });
  }

  componentWillUnmount() {
    const audio = this._audioRef.current;

    audio.oncanplaythrough = null;
    audio.onplay = null;
    audio.onpause = null;
    audio.ontimeupdate = null;
    audio.src = ``;
  }

  componentDidUpdate() {
    const audio = this._audioRef.current;
    if (this.state.isPlaying) {
      audio.play();
    } else {
      audio.pause();
    }
  }


  render() {
    const {isLoading, isPlaying} = this.state;
    const {onPlayButtonClick} = this.props;

    return (
      <React.Fragment>
        <button
          className={`track__button track__button--${isPlaying ? `pause` : `play`}`}
          type="button"
          disabled={isLoading}
          onClick={() => {
            this.setState((prevState) => ({isPlaying: !prevState.isPlaying}));
            onPlayButtonClick();
          }}
        />
        <div className="track__status">
          <audio
            ref={this._audioRef}
          />
        </div>
      </React.Fragment>
    );
  }
}

AudioPlayer.propTypes = {
  src: PropTypes.string.isRequired,
  onPlayButtonClick: PropTypes.func.isRequired,
  isPlaying: PropTypes.bool.isRequired,
};
