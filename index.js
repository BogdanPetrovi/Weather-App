import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index.ejs", { content: "Waiting for data..." });
}); 

app.post("/submit",  async (req,res) => {
  const city = req.body.city;
  try {
    // transfering city name to longitude and latitude
    const result = await axios.get(`https://api.api-ninjas.com/v1/geocoding?city=${city}`, { headers:{'X-Api-Key': 'goP6VOYB2WDJMWwAvYebBQ==CLXeNXvjQTr6iNlz'} } );
    const longitude = result.data[0].longitude;
    const latitude = result.data[0].latitude;
    // transfering longitude and latitude to data i wanna display (temperature, wind speed, is day or night, apperent temperature)
    const result1 = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,is_day,wind_speed_10m&timezone=Europe%2FBerlin&forecast_days=1`);
    const data = result1.data.current;
    res.render("index.ejs", { content: data, city: city })

  } catch (error) {
    res.status(404).render("index.ejs", {error: "1"});
  }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

  // https://api.open-meteo.com/v1/forecast?latitude=44.8178131&longitude=20.4568974&current=temperature_2m,apparent_temperature,is_day,wind_speed_10m&timezone=Europe%2FBerlin&forecast_days=1