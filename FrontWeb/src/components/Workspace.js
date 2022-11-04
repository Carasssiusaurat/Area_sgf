import React, {state, setState} from "react";
import { NavLink } from "react-router-dom";
import styles from "../styles/components/Workspace.scss";


const List_Workspace = () => {
    let rows = [new Workspaces(), new Workspaces(), new Workspaces()];
    return(
        <>
        {rows.map((Row) => <Row.Aria></Row.Aria>)}
        </>
    );
}


class Workspaces extends React.Component {
    Workspaces(){
        this.state = {rows : []}
        this.Add_workspaces.bind(this);
    }

    Add_workspaces = () =>{
        let new_row = this.state.rows;
        new_row.push(this.Aria);
        this.setState(
            { rows : new_row }
        );
    }

    Aria = () => {
        return(
       <div className="aria">
            <div className = "global-services">
                <a>add a services</a>
            </div>
            <div className = "global-trends">
                <a>add a trend</a>
            </div>
            <div className = "global-responses">
                <a>add a responce</a>
            </div>
       </div> 
        );
    }

    

    render(){
        return(
           <this.Aria></this.Aria>
        );
    }


}

export default List_Workspace;