import React from "react";
import ConnectedCard from "./ConnectedCard";

class GetServicesData extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      isLoaded: false,
    };
  }
  componentDidMount() {
    if (this.props.id.services.length != 0) {
      for (let i = 0; i < this.props.id.services.length; i++) {
        fetch(
          "http://localhost:8080/service/" + this.props.id.services[i]._id,
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
              items: this.state.items.concat(json),
            });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
    this.state.isLoaded = true;
  }
  render() {
    const { isLoaded, items } = this.state;

    if (!isLoaded) return;

    return (
      <div className="test">
        {console.log(items)}
        {items.map((item, index) => (
          <ConnectedCard
            name={item.name}
            img_url={item.img_url}
            id={this.props.id.services[index]._id}
          />
        ))}
      </div>
    );
  }
}

export default GetServicesData;
