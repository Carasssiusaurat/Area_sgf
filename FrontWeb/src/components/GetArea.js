import React from "react";

class GetServicesId extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      isLoaded: false,
    };
  }

  componentDidMount() {
    fetch(
      "http://localhost:8080/user/" + sessionStorage.getItem("id") + "/area",
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
      }
    )
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
        ) : null}
        {sessionStorage.getItem("id_select_reaction") === null &&
        sessionStorage.getItem("id_select") != null ? (
          <GetServicesData
            data={items}
            id={sessionStorage.getItem("id_select")}
            page={this.props.page}
          ></GetServicesData>
        ) : null}
        {sessionStorage.getItem("id_select_reaction") != null &&
        sessionStorage.getItem("id_select") != null ? (
          <GetServicesData
            data={items}
            id={sessionStorage.getItem("id_select_reaction")}
            page={this.props.page}
          ></GetServicesData>
        ) : null}
      </div>
    );
  }
}

export default GetServicesId;
