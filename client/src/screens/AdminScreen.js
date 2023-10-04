import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Divider, Space, Tag } from "antd";
import { Tabs } from "antd";
import axios from "axios";
import Loader from "../components/Loader";
import useLocalState from "../utils/localState";

//include the logic to only allow admin privilleges

const AdminScreen = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!JSON.parse(localStorage.getItem("user")).isAdmin) {
      navigate("/home");
    }
  }, []);
  return (
    <>
      <div className="mt-3 mr-3 ml-3 bs">
        <h2 className="text-center " style={{ fontSize: "30px" }}>
          <b>Admin Panel</b>
        </h2>
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="Bookings" key="1">
            <AllBookings />
            {/* //you can directly write html or render component */}
          </Tabs.TabPane>
          <Tabs.TabPane tab="Rooms" key="2">
            <AllRooms />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Add Room" key="4">
            <h1>Add Room</h1>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Users" key="3">
            <AllUsers />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </>
  );
};

export default AdminScreen;

//I'll just write the component tabs here.

export const AllBookings = () => {
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { alert, showLocalAlert, hideLocalAlert } = useLocalState();

  const fetchBookings = async () => {
    try {
      const response = await axios.get("/api/v1/bookings/getAllBookings");
      const data = response.data;
      // console.log(data);
      setAllBookings(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      showLocalAlert({ text: error.response.data.msg, type: "danger" });
      hideLocalAlert();
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div>
      {alert.show && (
        <div className={`alert-local alert-local-${alert.type}`}>
          {alert.text}
        </div>
      )}

      <div className="col-md-10">
        <h1>Bookings</h1>
        {loading && <Loader />}

        <table className="table table-bordered table-dark">
          <thead className="bs dark">
            <tr>
              <th>Booking Id</th>
              <th>User Id</th>
              <th>Room</th>
              <th>From</th>
              <th>To</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {allBookings.length &&
              allBookings.map((booking, i) => {
                return (
                  <tr key={i}>
                    <td>{booking._id}</td>
                    <td>{booking.userId}</td>
                    <td>{booking.room}</td>
                    <td>{booking.fromDate}</td>
                    <td>{booking.toDate}</td>
                    <td>{booking.status}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

///all Rooms API

export const AllRooms = () => {
  const [allRooms, setAllRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const { alert, showLocalAlert, hideLocalAlert } = useLocalState();

  const fetchRooms = async () => {
    try {
      const response = await axios.get("/api/v1/rooms/getAllRooms");
      const data = response.data;
      // console.log(data);
      setAllRooms(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      showLocalAlert({ text: error.response.data.msg, type: "danger" });
      hideLocalAlert();
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <div>
      {alert.show && (
        <div className={`alert-local alert-local-${alert.type}`}>
          {alert.text}
        </div>
      )}

      <div className="col-md-10">
        <h1>Rooms</h1>
        {loading && <Loader />}

        <table className="table table-bordered table-dark">
          <thead className="bs dark">
            <tr>
              <th>Room Id</th>
              <th>Name</th>
              <th>Type</th>
              <th>Rent Per Day</th>
              <th>MAx Count</th>
              <th>Phone No</th>
            </tr>
          </thead>
          <tbody>
            {allRooms.length &&
              allRooms.map((room, i) => {
                return (
                  <tr key={i}>
                    <td>{room._id}</td>
                    <td>{room.type}</td>
                    <td>{room.rentperday}</td>
                    <td>{room.maxcount}</td>
                    <td>{room.phonenumber}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// All Users API

export const AllUsers = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { alert, showLocalAlert, hideLocalAlert } = useLocalState();

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/v1/users/getAllUsers");
      const data = response.data;
      // console.log(data);
      setAllUsers(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      showLocalAlert({ text: error.response.data.msg, type: "danger" });
      hideLocalAlert();
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      {alert.show && (
        <div className={`alert-local alert-local-${alert.type}`}>
          {alert.text}
        </div>
      )}

      <div className="col-md-10">
        <h1>Users</h1>
        {loading && <Loader />}

        <table className="table table-bordered table-dark">
          <thead className="bs dark">
            <tr>
              <th>User Id</th>
              <th>Name</th>
              <th>Email</th>
              <th>Is Admin</th>
            </tr>
          </thead>
          <tbody>
            {allUsers.length &&
              allUsers.map((user, i) => {
                return (
                  <tr key={i}>
                    <td>{user._id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.isAdmin ? "YES" : "NO"}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
