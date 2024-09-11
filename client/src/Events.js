import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { styled } from '@mui/material/styles';
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
import Paper from '@mui/material/Paper';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#FA2027',
  }),
}));


const Events = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  let username = localStorage.getItem("username");
  let token = localStorage.getItem("token");
  const API_URL = "http://localhost:5000/users";

  useEffect(() => {
    const getEventData = async () => {
      setLoading(true);
      const eventData = await axios.get(`${API_URL}/events`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      console.log(eventData);
      if (eventData?.data) {
        setData(eventData.data);
    }
      console.log("Event data"+ data);

      setLoading(false);
    };
    getEventData();
  }, []);

  return (
    <div className="mainContainer">
      {data !== null && data.length >= 1 && !loading ? (
        <Box>
          <Grid
            container
            spacing={2}
            direction="row"
            justify="flex-start"
            alignItems="flex-start"
          >
            {data?.map((elem) => (
              <Grid item xs={3} key={data.indexOf(elem)}>
                <Item>
                <Card variant="outlined">
                  <React.Fragment>
                    <CardContent>
                      <Typography
                        gutterBottom
                        sx={{ color: "text.secondary", fontSize: 14 }}
                      >
                        {elem.event_title}
                      </Typography>
                      <Typography variant="body2">
                        {elem.event_description}
                      </Typography>
                    </CardContent>
                    <CardActions>
                       <Link to="/EventDescription" state={{id: elem.event_id}}>
                        See Details
                      </Link>
                      <Link to="/FundEvent" state={{id: elem.event_id}}>
                        Fund Event
                      </Link>
                      <Link to="/DeleteEvent" state={{id: elem.event_id}}>
                        Delete Event
                      </Link>
                    </CardActions>
                  </React.Fragment>
                </Card>
                </Item>
              </Grid>
            ))}
          </Grid>
        </Box>
      ) : (
        <div>
          <p> No Events Found.</p>
        </div>
      )}
    </div>
  );
};

export default Events;
