import React from "react";
import { Switch, Route } from "react-router-dom";

import NewLog from "./pages/newLog";
import HomePage from "./pages/homepage";

function App() {
  return (
    <>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/new" component={NewLog} />
      </Switch>
    </>
  );
}

export default App;
