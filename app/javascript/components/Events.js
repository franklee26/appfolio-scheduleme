import React from "react";

// handle click and post request
const handleClickPost = (
  event,
  startTime,
  endTime,
  calendarId,
  calendarName
) => {
  event.preventDefault();
  var xhr = new XMLHttpRequest();
  xhr.open(
    "POST",
    `http://localhost:3000/calendar/${calendarId}/${startTime}/${endTime}`
  );
  xhr.send();
  alert(
    `Successfully added event starting at ${shortFormatDate(
      startTime
    )} to ${calendarName}!`
  );
};

const shortFormatDate = date => {
  var theDate = new Date(Date.parse(date)).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  });
  return theDate;
};

class Events extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      calendarResponse: null
    };
  }

  componentDidMount() {
    fetch(`http://localhost:3000/calendar/${this.props.calendar_id}/response`, {
      method: "GET"
    })
      .then(res => res.json())
      .then(
        result => {
          this.setState({
            isLoaded: true,
            calendarResponse: result
          });
        },
        error => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      );
  }

  render() {
    const { error, isLoaded, calendarResponse } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return (
        <div>
          <h1>Loading and scheduling times...</h1>
        </div>
      );
    }
    return (
      <div className="container">
        {this.props.events.length ? (
          <h1 align="center">
            Calendar events for {calendarResponse["summary"]}:
          </h1>
        ) : (
          `No events in ${calendarResponse["summary"]} calendar`
        )}
        <h4>
          {" "}
          Submit your free times (pulled from the last two weeks from everyone's
          calendars):{" "}
        </h4>
        {this.props.free_times.map(timeHash => (
          <table>
            <td>
              <a
                href="#"
                onClick={e => {
                  handleClickPost(
                    e,
                    timeHash["start"],
                    timeHash["end"],
                    this.props.calendar_id,
                    calendarResponse["summary"]
                  );
                }}
              >
                From {shortFormatDate(timeHash["start"])} to{" "}
                {shortFormatDate(timeHash["end"])}{" "}
              </a>
            </td>
          </table>
        ))}
        <ul>
          {this.props.events.map(event => (
            <li key={event.id}>
              {event.summary} starting at{" "}
              {new Date(Date.parse(event.end.date_time)).toLocaleDateString(
                "en-US",
                {
                  weekday: "long",
                  hour: "2-digit",
                  minute: "2-digit"
                }
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default Events;
