import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";
import Error from "../components/Error";
import moment from "moment";
import { useGlobalContext } from "../context";
import useLocalState from "../utils/localState";
import StripeCheckout from "react-stripe-checkout";

const BookingScreen = () => {
  const { user } = useGlobalContext();
  const { alert, showLocalAlert, hideLocalAlert } = useLocalState();
  const { id, fromDate, toDate } = useParams();
  const [room, setRoom] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  const firstDay = moment(fromDate, "DD-MM-YYYY");
  const lastDay = moment(toDate, "DD-MM-YYYY");

  const totalDays = moment.duration(lastDay.diff(firstDay)).asDays() + 1;
  // const totalAmount = totalDays * room.rentperday;
  const [totalAmount, setTotalAmount] = useState();

  const fetchSingleRoomDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/v1/rooms/getSingleRoom/${id}`);
      const data = await response.data;
      // console.log(data);
      setRoom(data);

      setTotalAmount(data.rentperday * totalDays);
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

  const bookRoom = async () => {
    const bookingDetails = {
      room: room.name,
      roomId: room._id,
      userId: user._id,
      fromDate,
      toDate,
      totalAmount,
      totalDays,
    };
    try {
      const { data } = await axios.post(
        "/api/v1/bookings/bookroom",
        bookingDetails
      );
      showLocalAlert({ text: data.msg, type: "success" });
      hideLocalAlert();
    } catch (error) {
      console.log("err while booking room: ", error);
      showLocalAlert({ text: error.response.data.msg, type: "danger" });
      hideLocalAlert();
    }
  };

  const onToken = (token) => {
    console.log(token);
  };

  return (
    <div className="m-5">
      {alert.show && (
        <div className={`alert-local alert-local-${alert.type}`}>
          {alert.text}
        </div>
      )}

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
                  <p>Name : {user.name}</p>
                  <p>From Date : {fromDate} </p>
                  <p>To Date : {toDate}</p>
                  <p>Max Count : {room.maxcount}</p>
                </b>
              </div>
              <div style={{ textAlign: "right" }}>
                <b>
                  <h1>Amount</h1>
                  <br />
                  <p>Total days : {totalDays}</p>
                  <p>Rent per day: {room.rentperday}</p>
                  <p>Total Amount : {totalAmount}</p>
                </b>
              </div>
              <div style={{ float: "right" }}>
                <button className="btn btn-primary" onClick={bookRoom}>
                  Pay now
                </button>
                <StripeCheckout
                  token={onToken}
                  amount={totalAmount * 100}
                  currency="KES"
                  stripeKey="pk_test_51NgCdvBTTWsEUllBkVdircAKppOrZbSkirkYYrQ3YMQj4OvvkUQzHjjSlB5V3FeTgkXnLl0RpUJgfqREifyzmgaR00CWd5kl9D"
                />
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
