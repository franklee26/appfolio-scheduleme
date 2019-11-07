import React from "react";

const Events = props => {
  return (
    <div>
      {props.events.length ? (
        <h1 align="center">
          Calendar events for {props.events[0].organizer.display_name}:
        </h1>
      ) : (
        "No events in this calendar"
      )}
      <ul>
        {props.events.map(event => (
          <li key={event.id}>
            {event.summary} starting at{" "}
            {new Date(Date.parse(event.end.date_time)).toLocaleDateString(
              "en-US",
              { weekday: "long", hour: "2-digit", minute: "2-digit" }
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Events;
