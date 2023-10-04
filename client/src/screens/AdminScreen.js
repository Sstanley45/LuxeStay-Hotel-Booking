import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Divider, Space, Tag } from "antd";
import { Tabs } from "antd";
import axios from "axios";
import Loader from "../components/Loader";
import useLocalState from "../utils/localState";
import swal from "sweetalert2";

const AdminScreen = () => {
  const navigate = useNavigate();

  //include the logic to only allow admin privilleges
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
            <AddRoom />
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

//add Room API
export const AddRoom = () => {
  const [name, setName] = useState("");
  const [rentperday, setRentPerDay] = useState("");
  const [maxcount, setMaxCount] = useState("");
  const [description, setDescription] = useState("");
  const [phonenumber, setPhoneNumber] = useState("");
  const [type, setType] = useState("");
  const [imageUrl1, setImageUrl1] = useState("");
  const [imageUrl2, setImageUrl2] = useState("");
  const [imageUrl3, setImageUrl3] = useState("");
  const [loading, setLoading] = useState(true);
  const { alert, showLocalAlert, hideLocalAlert } = useLocalState();
  const navigate = useNavigate();
  const addRoomAPI = async () => {
    const newRoom = {
      name,
      rentperday,
      maxcount,
      description,
      phonenumber,
      type,
      imageurls: [imageUrl1, imageUrl2, imageUrl3],
    };
    try {
      setLoading(true);
      const response = await axios.post("/api/v1/rooms/createRoom", newRoom);
      const data = response.data;
      swal.fire(data.msg, "success").then((res) => {
        setTimeout(() => {
          navigate("/home");
        }, 1000);
      });
      setLoading(false);
    } catch (error) {
      console.log(error);
      swal.fire(error.response.data.msg, "error");
      setLoading(false);
    }
  };

  return (
    <div>
      {alert.show && (
        <div className={`alert-local alert-local-${alert.type}`}>
          {alert.text}
        </div>
      )}
      {loading && <loader />}
      <div className="row">
        <div className="col-md-5">
          <input
            type="text"
            className="form-control admin-input"
            placeholder="room name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            className="form-control admin-input"
            placeholder="rent per day"
            value={rentperday}
            onChange={(e) => setRentPerDay(e.target.value)}
          />
          <input
            type="text"
            className="form-control admin-input"
            placeholder="max count"
            value={maxcount}
            onChange={(e) => setMaxCount(e.target.value)}
          />
          <input
            type="text"
            className="form-control admin-input"
            placeholder="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type="text"
            className="form-control admin-input"
            placeholder="phone number"
            value={phonenumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>
        <div className="col-md-5">
          <input
            type="text"
            className="form-control admin-input"
            placeholder="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
          />
          <input
            type="text"
            className="form-control admin-input"
            placeholder="Image URL 1"
            value={imageUrl1}
            onChange={(e) => setImageUrl1(e.target.value)}
          />
          <input
            type="text"
            className="form-control admin-input"
            placeholder="Image URL 2"
            value={imageUrl2}
            onChange={(e) => setImageUrl2(e.target.value)}
          />
          <input
            type="text"
            className="form-control admin-input"
            placeholder="Image URL 3"
            value={imageUrl3}
            onChange={(e) => setImageUrl3(e.target.value)}
          />
          <div className="text-right mt-3">
            <button className="btn btn-primary" onClick={addRoomAPI}>
              Add Room
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
