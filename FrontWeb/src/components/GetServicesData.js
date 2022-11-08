import React from "react";
import ConnectedCard from "./ConnectedCard";
import List_Workspace from "../components/Workspace";
import BigCard from "../components/BigCard";

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
        {this.props.page === "0" ? (
          items.map((item, index) => (
            <ConnectedCard
              name={item.name}
              img_url={item.img_url}
              id={this.props.id.services[index]._id}
            />
          ))
        ) : (
          <List_Workspace items={items} id={this.props.id.services} />
        )}
        {/* {console.log(items)} */}
      </div>
    );
  }
}

export default GetServicesData;
