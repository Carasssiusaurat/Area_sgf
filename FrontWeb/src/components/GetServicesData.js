import React from "react";
import ConnectedCard from "./ConnectedCard";
import List_Workspace from "../components/Workspace";
import BigCard from "../components/BigCard";

class GetServicesData extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      area: [],
      data: [],
      isLoaded: false,
    };
  }
  componentDidMount() {
    // const id = "";
    // if (this.props.page === 2)
    //   id = this.props.id
    // else
    if (this.props.page != "2") {
      console.log("ALLO");
      // if (this.props.id.services.length != 0) {
      //   for (let i = 0; i < this.props.id.services.length; i++) {
      //     fetch(
      //       "http://localhost:8080/service/" + this.props.id.services[i]._id,
      //       {
      //         method: "GET",
      //         headers: {
      //           Authorization: "Bearer " + sessionStorage.getItem("token"),
      //         },
      //       }
      //     )
      //       .then((res) => res.json())
      //       .then((json) => {
      //         this.setState({
      //           items: this.state.items.concat(json),
      //         });
      //       })
      //       .catch((err) => {
      //         console.log(err);
      //       });
      //   }
      // }
      if (this.props.id.services.length != 0) {
        for (let i = 0; i < this.props.id.services.length; i++) {
          fetch(
            "http://localhost:8080/user/" +
              sessionStorage.getItem("id") +
              "/service",
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
              });
            })
            .catch((err) => {
              console.log(err);
            });
        }
      }
    }
    // console.log(this.props.page);
    if (this.props.page === "2") {
      console.log("ALLO");
      fetch("http://localhost:8080/service/" + this.props.id, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
      })
        .then((res) => res.json())
        .then((json) => {
          this.setState({
            items: this.state.items.concat(json),
          });
        })
        .catch((err) => {
          console.log(err);
        });
      fetch("http://localhost:8080/service/" + this.props.id + "/action", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
      })
        .then((res) => res.json())
        .then((json) => {
          this.setState({
            area: json,
          });
        })
        .catch((err) => {
          console.log(err);
        });
      for (let i = 0; i < this.props.data.services.length; i++) {
        fetch(
          "http://localhost:8080/user/" +
            sessionStorage.getItem("id") +
            "/service",
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
              data: json,
            });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
    console.log("YOUPIIIIIIIIIIIII");
    this.state.isLoaded = true;
  }

  render() {
    const { isLoaded, items, area, data } = this.state;

    if (!this.state.isLoaded) return;
    // if (this.props.page === "2") console.log(this.props.page);

    return (
      <div className="test">
        {/* {console.log(this.props.page)}
        {this.props.page === "0" ? (
          items.map((item, index) => (
            <ConnectedCard
              name={item.name}
              img_url={item.img_url}
              id={this.props.id.services[index]._id}
            />
          ))
        ) : this.props.page === "1" ? (
          <List_Workspace items={items} id={this.props.id.services} />
        ) : (
          <List_Workspace items={this.props.page} id={this.props.id.services} />
        )} */}
        {/* {console.log(this.props.page)} */}
        {/* {this.props.page == "2" ? console.log("OUI DE FOU") : null} */}
        {/* {console.log(items)} */}
        {/* {console.log(items[0].)} */}
        {this.props.page === "0"
          ? items.map((item, index) => (
              <ConnectedCard
                name={item.name}
                img_url={item.img_url}
                id={item._id}
              />
            ))
          : null}
        {this.props.page === "1" ? (
          <List_Workspace items={items} id={this.props.id.services} />
        ) : null}
        {this.props.page === "2" ? (
          <List_Workspace
            items={items}
            id={items}
            page={this.props.page}
            area={area}
            data={data}
          />
        ) : null}
      </div>
    );
  }
}

export default GetServicesData;
