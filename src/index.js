import React from 'react';
import ReactDOM from 'react-dom';


class PomodoroClock extends React.Component {
  constructor(props) {
      super(props);
    
      this.decreaseBreakLength = this.decreaseBreakLength.bind(this);
      this.increaseBreakLength = this.increaseBreakLength.bind(this);
    
      this.decreaseSessionLength = this.decreaseSessionLength.bind(this);
      this.increaseSessionLength = this.increaseSessionLength.bind(this);
    
      this.toggleTimer = this.toggleTimer.bind(this);
    
      this.state = {
        breakLength: 25,
        sessionLength: 25,
        sessionTimer: 25 * 60,
        timerSet: false,
        breakSessionSet: false
      };
    
  }
  
  decreaseBreakLength() {
    const { breakLength, timerSet, breakSessionSet } = this.state;
    
    if (!timerSet) {
      this.setState({
        breakLength: breakLength > 0 ? breakLength - 1 : 0,
      });
      
      if (breakSessionSet) {
        this.setState({
          sessionTimer: breakLength > 0 ? (breakLength - 1) * 60 : 0
        });
      }
      
    }
  }
  
  increaseBreakLength() {
    const { breakLength, timerSet, breakSessionSet } = this.state;
    
    if (!timerSet) {
      this.setState({
        breakLength: breakLength >= 0 ? breakLength + 1 : 0,
      });
      
      if (breakSessionSet) {
        this.setState({
          sessionTimer: breakLength >= 0 ? (breakLength + 1) * 60 : 0
        });
      }
      
    }
  }
  
  
  decreaseSessionLength() {
    const { sessionLength, timerSet, breakSessionSet } = this.state;
    
    if (!timerSet) {
      this.setState({
        sessionLength: sessionLength > 0 ? sessionLength - 1 : 0,
      }); 
      
      if (!breakSessionSet) {
        this.setState({
          sessionTimer: sessionLength > 0 ? (sessionLength - 1) * 60 : 0
        });
      }
      
    }
  }
  
  increaseSessionLength() {
    const { sessionLength, timerSet, breakSessionSet } = this.state;
    
    if (!timerSet) {
      this.setState({
        sessionLength: sessionLength >= 0 ? sessionLength + 1 : 0,
      }); 
      
      if (!breakSessionSet) {
        this.setState({
          sessionTimer: sessionLength >= 0 ? (sessionLength + 1) * 60 : 0
        });
      }
      
    }
  }
  
  tick() {
    const { sessionTimer, breakLength, sessionLength, breakSessionSet } = this.state;
    
    if (sessionTimer === 0) { // session ended, time to start break/session session
      this.setState({
        breakSessionSet: !breakSessionSet
      });
      
      clearInterval(this.bTimerID);
      
      const wav = "http://soundbible.com/grab.php?id=1599&type=mp3";
      const audio = new Audio(wav);
			audio.play();
      
      if (this.state.breakSessionSet) {
        this.setState({
          sessionTimer: breakLength * 60
        });
      } else {
          this.setState({
            sessionTimer: sessionLength * 60,
          });
      }
      
      this.bTimerID = setInterval( () => this.tick(), 1000);
    }
    else {
      this.setState({
        sessionTimer: sessionTimer > 0 ? sessionTimer - 1 : sessionTimer
      });
      let sessionLengthInSeconds = 60 * sessionLength; // sessionTimer = seconds remaining
      let percent = Math.abs((sessionTimer / sessionLengthInSeconds) * 100 - 100);
      this.refs.progressBar.style.height = percent + "%";
    }
  }
  
  toggleTimer() {
    const { timerSet } = this.state;
    
    if (timerSet) {
      this.setState({
        timerSet: !timerSet
      });
      clearInterval(this.timerID);
      clearInterval(this.bTimerID);
    }
    else {
      this.setState({
        timerSet: !timerSet,
      });
      this.timerID = setInterval( () => this.tick(), 1000);
    }
    
  }
  
  transformSecondsToHMS(_seconds) {
    const hours = Math.floor(_seconds / 3600);
    const minutes = Math.floor(_seconds % 3600 / 60);
    const seconds = Math.floor(_seconds % 3600 % 60);
    return (
      (hours > 0 ? hours + ":" + (minutes < 10 ? "0" : "") : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds
    );
  }
  render() {
    
    const { breakLength, sessionLength, sessionTimer, breakSessionSet } = this.state;

    const sessionMinutes = parseInt(sessionTimer / 60);
    const sessionSeconds = String(sessionTimer % 60).length == 1 ? "0" + String(sessionTimer % 60): String(sessionTimer % 60);
    
//        <pre style={{backgroundColor: "white"}}>{JSON.stringify(this.state, null, 2)}</pre>
    return ( <div className="">
                <h2>Pomodoro Clock</h2>
                <div className="controls">
                    <div className="break-length-control">
                        <h5>Break length</h5>
                        <button className="minus" onClick={this.decreaseBreakLength}>-</button>
                        <span className="length">{breakLength}</span>
                        <button className="plus" onClick={this.increaseBreakLength}>+</button>
                    </div>
                    <div className="session-length-control">
                        <h5>Session length</h5>
                        <button className="minus" onClick={this.decreaseSessionLength}>-</button>
                        <span class="length">{sessionLength}</span>
                        <button className="plus" onClick={this.increaseSessionLength}>+</button>
                    </div>
                </div>
                <div className="session">
                  <div className="tomato" onClick={this.toggleTimer}>
                    <span className="session-header">{breakSessionSet ? "Break" : "Session"}</span>
                    <span className="session-timer">{this.transformSecondsToHMS(sessionTimer)}</span>
                    <span className="progress-bar" ref="progressBar" style={{height: 0}}></span>
                  </div>
                </div>
            </div>
    )
  }
}

ReactDOM.render(<PomodoroClock/>, document.getElementById("app"));