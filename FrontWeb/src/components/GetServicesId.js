import React from "react";
import GetServicesData from "./GetServicesData";

class GetServicesId extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      isLoaded: false,
    };
  }

  componentDidMount() {
    fetch("http://localhost:8080/user/" + sessionStorage.getItem("id"), {
      method: "GET",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          items: json,
          isLoaded: true,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    const { isLoaded, items } = this.state;

    if (!isLoaded) return;

    return (
      <div className="test">
        {/* {console.log(this.props.page)} */}
        {sessionStorage.getItem("id_select") === null ? (
          <GetServicesData id={items} page={this.props.page}></GetServicesData>
        ) : (
          <GetServicesData
            id={sessionStorage.getItem("id_select")}
            page={this.props.page}
          ></GetServicesData>
        )}
      </div>
    );
  }
}

export default GetServicesId;
