const weatherAPI = async (location) => {
  try {
    const weatherInfo = [];

    for (const { date, city } of location) {
      if (date.toLowerCase() === "today") {
        const reply = await fetch(
          `http://api.weatherapi.com/v1/current.json?key=5886cf48cabc45a89cb64502250611&q=${city}`
        );
        const data = await reply.json();
        weatherInfo.push(data);
      } else {
        const reply = await fetch(
          `http://api.weatherapi.com/v1/future.json?key=5886cf48cabc45a89cb64502250611&q=${city}&dt=${date}`
        );
        const data = await reply.json();
        weatherInfo.push(data);
      }
    }

    return weatherInfo;
  } catch (error) {
    return res.status(404).json({
      message: "Failed!",
      success: false,
    });
  }
};

const stockAPI = async (symbol) => {
  try{

  const stockInfo = [];
  for (const { company } of symbol) {
    const response = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${process.env.STOCK_API_KEY}`
    );

    response = await response.json();
    stockInfo.push(response);
  }

  return stockInfo;
  }
  catch(error){
    return res.status(404).json({
      success:false,
      message:'Failed!'
    })
  }
  
};




export { weatherAPI, stockAPI };
