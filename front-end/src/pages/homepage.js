import React from "react";
import { Link } from "react-router-dom";

import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import { Typography } from "@material-ui/core";

const HomePage = () => {
  return (
    <>
      <h1> Home Page</h1>
      <Grid container spacing={4}>
        <Grid item>
          <Card>
            <CardActions>
              <Link to="/new" style={{ textDecoration: "none" }}>
                <Button>New</Button>
              </Link>
            </CardActions>
          </Card>
        </Grid>
        <Grid item>
          <Card>
            <CardContent>
              <h1>Photo goes here</h1>
            </CardContent>
            <CardActions></CardActions>
          </Card>
        </Grid>
        <Grid item>
          <Card>
            <CardContent>
              <h1>Photo goes here</h1>
            </CardContent>
            <CardActions></CardActions>
          </Card>
        </Grid>
        <Grid item>
          <Card>
            <CardContent>
              <h1>Photo goes here</h1>
            </CardContent>
            <CardActions></CardActions>
          </Card>
        </Grid>
        <Grid item>
          <Card>
            <CardContent>
              <h1>Photo goes here</h1>
            </CardContent>
            <CardActions></CardActions>
          </Card>
        </Grid>
        <Grid item>
          <Card>
            <CardContent>
              <h1>Photo goes here</h1>
            </CardContent>
            <CardActions></CardActions>
          </Card>
        </Grid>
        <Grid item>
          <Card>
            <CardContent>
              <h1>Photo goes here</h1>
            </CardContent>
            <CardActions></CardActions>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default HomePage;
