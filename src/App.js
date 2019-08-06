import React from "react";
import "./App.css";

import "./sass/app.scss";

import TopSection from "./components/Top";
import BottomSection from "./components/Bottom";

import axios from "axios";

const weather_key = "271a485ddeb2478fbc1192525193107";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cityName: "Lubbock",
      numforcastDays: 4,
      isloading: true
    };
  }

  updateWeather() {
    const { cityName, numforcastDays } = this.state;

    const URL = `https://api.apixu.com/v1/forecast.json?key=${weather_key} &q=${cityName} &days=${numforcastDays}`;
    axios
      .get(URL)
      .then(res => {
        return res.data;
      })
      .then(data => {
        this.setState({
          isloading: false,
          temp_f: data.current.temp_f,
          isDay: data.current.is_day,
          text: data.current.condition.text,
          iconURL: data.current.condition.icon,
          forecastdays: data.forecast.forecastday
        });
      })
      .catch(err => {
        if (err) console.error("Cannot fetch Weather Data from API, ", err);
      });
  }

  componentDidMount() {
    const { cityName, numforcastDays } = this.state;
    const { eventEmitter } = this.props;

    this.updateWeather();

    eventEmitter.on("updateWeather", data => {
      this.setState({ cityName: data }, () => this.updateWeather());

      console.log("LocationName", data);
    });
  }

  render() {
    const {
      isloading,
      cityName,
      temp_f,
      isDay,
      text,
      iconURL,
      forecastdays
    } = this.state;
    const { eventEmitter } = this.props;

    return (
      <div className="app-container">
        <div className="main-container">
          {isloading && <h3>Leading Weather...</h3>}
          {!isloading && (
            <div className="top-section">
              <TopSection
                location={cityName}
                temp_f={temp_f}
                isDay={isDay}
                text={text}
                iconURL={iconURL}
                eventEmitter={this.props.eventEmitter}
              />
            </div>
          )}
          <div className="bottom-section">
            <BottomSection forecastdays={forecastdays} />
          </div>
        </div>
      </div>
    );
  }
}
