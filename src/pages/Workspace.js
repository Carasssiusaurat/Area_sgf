import React from "react";
import Navigation from "../components/Navigation";
import Services from "../components/Services";
import List_Workspace from "../components/Workspace";
import { DragDropContext } from "react-beautiful-dnd";

const Workspace = () => {
  return (
    <DragDropContext>
    <div>
      <Navigation></Navigation>
      <List_Workspace></List_Workspace>
    </div>
    </DragDropContext>
  );
};

export default Workspace;
