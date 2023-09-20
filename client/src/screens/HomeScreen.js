import React, { useState, useEffect } from "react";
import axios from "axios";
import Room from "../components/Room";
import Loader from "../components/Loader";
import Error from "../components/Error";

const HomeScreen = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/v1/rooms/getAllRooms");
      const data = await response.data; //axios already parse the data into json so I avoid using .json()
      setRooms(data);
      setLoading(false);
    } catch (error) {
     // setError(true);
      console.log("error while fetching data", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div className="container">
        <div className="row justify-content-center mt-5">
          {loading ? (
            <Loader />
          ) : rooms.length >1 ? (
            rooms.map((room,i) => {
              return (
                <div key={i} className="col-md-9 mt-2 ">
                  <Room room={room} />
                </div>
              );
            })
          ) : (
            <Error /> 
          )}
        </div>
      </div>
    </>
  );
};

export default HomeScreen;
