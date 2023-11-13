import React, { useEffect, useState } from "react";
import { Tabs } from "antd";
import { useGlobalContext } from "../context";
import useLocalState from "../utils/localState";
import Loader from "../components/Loader";
import axios from "axios";
import Swal from "sweetalert2";
import { Tag } from "antd";

//profile page is a protected route so a user is required!
const user = JSON.parse(localStorage.getItem("user"));

const Profile = () => {
  return (
    <div className="ml-3 mt-3">
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Profile" key="1">
          <h1> Profile </h1>
          <br />
          <h1>Name: {user.name}</h1>
          <h1>Email: {user.email}</h1>
          <h1>isAdmin: {user.isAdmin ? "Yes" : "No"}</h1>

          {/* //you can directly write html or render component */}
        </Tabs.TabPane>
        <Tabs.TabPane tab="Bookings" key="2">
          <MyBookings />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default Profile;

//I write the components for the tabs here

export const MyBookings = () => {
  const { alert, showLocalAlert, hideLocalAlert } = useLocalState();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserBookings = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post("/api/v1/bookings/userBookings", {
        userID: user._id,
      });
      // console.log(data);
      setBookings(data);
      setLoading(false);
    } catch (error) {
      showLocalAlert({ text: error.response.data.msg, type: "danger" });
      hideLocalAlert();
      setLoading(false);
      console.log("error fetching user bookings", error);
    }
  };
  useEffect(() => {
    fetchUserBookings();
  }, []);

  const cancelBooking = async (bookingId, roomId) => {
    setLoading(true);
    try {
      const response = await axios.post("/api/v1/bookings/cancelBooking", {
        bookingId,
        roomId,
      });
      const data = await response.data;
      Swal.fire(data.msg, "success").then((result) => {
        window.location.reload();
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Swal.fire("Oops!", error.response.data.msg, "error");
      console.log("error while cancelling booking: ", error);
    }
  };

  return (
    <>
      <div className="row">
        {alert.show && (
          <div className={`alert-local alert-local-${alert.type}`}>
            {alert.text}
          </div>
        )}
        <div className="col-md-6">
          {loading && <Loader />}
          {bookings &&
            bookings.map((booking, i) => {
              return (
                <div className="bs" key={i}>
                  <p>
                    <u>{booking.room}</u>
                  </p>
                  <p>
                    <b>Booking Id :</b> {booking._id}
                  </p>
                  <p>
                    <b>Check In : </b>
                    {booking.fromDate}
                  </p>
                  <p>
                    <b>Check Out :</b> {booking.toDate}
                  </p>
                  <p>
                    <b>Amount :</b> {booking.totalAmount}
                  </p>
                  <p>
                    <b>Status : </b>
                    {booking.status === "booked" ? (
                      <Tag color="green">BOOKED</Tag>
                    ) : (
                      <Tag color="red">CANCELLED</Tag>
                    )}
                  </p>
                  <div className="text-right">
                    {booking.status !== "cancelled" && (
                      <button
                        className="btn btn-primary"
                        onClick={() =>
                          cancelBooking(booking._id, booking.roomId)
                        }
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};
