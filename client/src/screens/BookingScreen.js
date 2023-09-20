import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";
import Error from "../components/Error";

const BookingScreen = () => {
  const { id } = useParams();
  const [room, setRoom] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  const fetchSingleRoomDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/v1/rooms/getSingleRoom/${id}`);
      const data = await response.data;
      // console.log(data);
      setRoom(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(true);
      console.log("error when fetching single room details : ", error);
    }
  };

  useEffect(() => {
    fetchSingleRoomDetails();
  }, [id]);

  return (
    <div className="m-5">
      {loading ? (
        <Loader />
      ) : room ? (
        <div>
          <div className="row justify-content-center mt-5 bs">
            <div className="col-md-6">
              <h1>{room.name}</h1>
              <img src={room.imageurls[0]} alt="image" className="bigimg" />
            </div>
            <div className="col-md-6">
              <div style={{ textAlign: "right" }}>
                <h1>Booking Details</h1>
                <br />
                <b>
                  <p>Name : </p>
                  <p>From Date : </p>
                  <p>To Date : </p>
                  <p>Max Count : {room.maxcount}</p>
                </b>
              </div>
              <div style={{ textAlign: "right" }}>
                <b>
                  <h1>Amount</h1>
                  <br />
                  <p>Total days :</p>
                  <p>Rent per day: {room.rentperday}</p>
                  <p>Total Amount</p>
                </b>
              </div>
              <div style={{ float: "right" }}>
                <button className="btn btn-primary">Pay now</button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Error />
      )}
    </div>
  );
};

export default BookingScreen;
