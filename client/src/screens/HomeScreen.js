import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Room from "../components/Room";
import Loader from "../components/Loader";
import Error from "../components/Error";
import { useGlobalContext } from "../context";
import { DatePicker, Space } from "antd";
import moment from "moment";

const { RangePicker } = DatePicker;

const HomeScreen = () => {
  const navigate = useNavigate();

    useEffect(() => {
      if (!JSON.parse(localStorage.getItem("user"))) {
        navigate("/login");
      }
    }, []);
  const { fetchUser } = useGlobalContext();
  
  const [rooms, setRooms] = useState([]);
  const [duplicateRooms, setDuplicateRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();
  //state for filtering by search
  const [searchKey, setSearchKey] = useState("");
  //state for filter by select
  const [type, setType] = useState();

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/v1/rooms/getAllRooms");
      const data = await response.data; //axios already parse the data into json so I avoid using .json()
      setRooms(data);
      setDuplicateRooms(data); //we create a state to hold rooms so that we can manipulate it in the filtering function to avoid manipulating the original rooms array.
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

  useEffect(() => {
    fetchUser();
    // console.log(moment('2023-10-20').format("DD-MM-YYYY"));
  }, []);

  //when the user clicks the filterByDate() we have to check the all the rooms that are having the current bookings.
  //so if any room is having the currentBookings we check the booking date by looping through the currentbookings array.

  const filterByDate = (dates) => {
    setFromDate(dates[0].format("DD-MM-YYYY"));
    setToDate(dates[1].format("DD-MM-YYYY"));
    // console.log(dates[0].format("DD-MM-YYYY"));
    // console.log(dates[1].format("DD-MM-YYYY"));

    //we create an array to hold the filtered rooms array
    var tempRooms = [];

    //now we loop through the duplicate array using for of
    for (const room of duplicateRooms) {
      var availability = false; // if this boolean is true push to tempRoom array
      //first check if the room is having any current bookings or not..
      if (room.currentbookings.length > 0) {
        //the currentbookings is an array so we still have to loop throug it.
        for (const booking of room.currentbookings) {
          //check if the selected date range is between the currentbookings range or not:-
          // console.log(booking);
          if (
            !(
              dates[0].format("DD-MM-YYYY") > booking.fromDate &&
              dates[0].format("DD-MM-YYYY") < booking.toDate
            ) &&
            !(
              dates[1].format("DD-MM-YYYY") > booking.fromDate &&
              dates[1].format("DD-MM-YYYY") < booking.toDate
            )
          ) {
            if (
              moment(dates[0].format("DD-MM-YYYY"))._i !== booking.fromDate && //you can as well omit using the moment function an ._i
              moment(dates[0].format("DD-MM-YYYY"))._i !== booking.toDate &&
              moment(dates[1].format("DD-MM-YYYY"))._i !== booking.fromDate &&
              moment(dates[1].format("DD-MM-YYYY"))._i !== booking.toDate
            ) {
              if (
                !(
                  booking.fromDate > dates[0].format("DD-MM-YYYY") &&
                  booking.fromDate < dates[1].format("DD-MM-YYYY")
                ) ||
                !(
                  booking.toDate > dates[0].format("DD-MM-YYYY") &&
                  booking.toDate < dates[1].format("DD-MM-YYYY")
                )
              ) {
                availability = true;
                console.log("here");
                console.log(moment("10-30-2023").format("YYYY-MM-DD"));
                // console.log(
                //   moment("2023-10-30").format("DD-MM-YYYY") <
                //     moment("2023-10-15").format("DD-MM-YYYY")
                // );
              }
            }
          }
        }
      }
      if (availability === true || room.currentbookings.length === 0) {
        tempRooms.push(room);
      }
    }
    setRooms(tempRooms);
  };

  const filterBySearch = () => {
    const filteredRooms = duplicateRooms.filter((room) =>
      room.name.toLowerCase().includes(searchKey.toLowerCase())
    );
    setRooms(filteredRooms);
  };

  const filterByType = (e) => {
    if (e === "All") {
      setRooms(duplicateRooms);
    } else {
      const filteredRooms = duplicateRooms.filter(
        (room) => room.type.toLowerCase() === e.toLowerCase()
      );
      setRooms(filteredRooms);
    }
  };

  return (
    <>
      <div className="container">
        <div className="row mt-5 bs m-auto">
          <div className="col-md-3">
            <RangePicker
              className="cal homeScreen-input"
              format="DD-MM-YYYY"
              onChange={(values) => filterByDate(values)}
            />
          </div>
          <div className="col-md-3 mx-auto">
            <input
              type="text"
              className="form-control homeScreen-input"
              placeholder="search rooms"
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
              onKeyUp={filterBySearch}
            />
          </div>
          <div className="col-md-3">
            <select
              name=""
              id=""
              className="from-control homeScreen-input"
              value={type}
              onChange={(e) => filterByType(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Delux">Delux</option>
              <option value="Non-Delux">Non-Delux</option>
            </select>
          </div>
        </div>

        <div className="row justify-content-center mt-5">
          {loading ? (
            <Loader />
          ) : (
            rooms.map((room, i) => {
              return (
                <div key={i} className="col-md-9 mt-2 ">
                  <Room room={room} fromDate={fromDate} toDate={toDate} />
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

export default HomeScreen;

// for (const room of duplicateRooms) {
//   //first check if the room is having any current bookings or not..
//   if (room.currentbookings.length > 0) {
//     //the currentbookings is an array so we still have to loop throug it.
//     for (const booking of room.currentbookings) {
//       //check if the selected date range is between the currentbookings range or not:-
//       if (
//         moment(moment(dates[0].format("DD-MM-YYYY"))._i).isBetween(
//           booking.fromDate,
//           booking.toDate
//         ) &&
//         moment(moment(dates[1].format("DD-MM-YYYY"))._i).isBetween(
//           booking.fromDate,
//           booking.toDate
//         )
//       ) {
//         if (
//           moment(dates[0].format("DD-MM-YYYY"))._i !== booking.fromDate &&
//           moment(dates[0].format("DD-MM-YYYY"))._i !== booking.toDate &&
//           moment(dates[1].format("DD-MM-YYYY"))._i !== booking.fromDate &&
//           moment(dates[1].format("DD-MM-YYYY"))._i !== booking.toDate
//         ) {
//           availability = true;
//           console.log("booking.toDate : ", booking.toDate);
//           console.log("booking.fromDate : ", booking.fromDate);
//         }
//       }
//     }
//   }
//   if (availability === true || room.currentbookings.length === 0) {
//     tempRooms.push(room);
//   }
//   setRooms(tempRooms);
// }

// return date.format('YYYY-MM-DD'); //ROMOVE THE MOMENT FUNCTION TO STOP IT FROM ALWAYS GIVING THE CURRENT DATE.
//I have found myself in a paradox - When I include the moment() the date gives a current date (moment(dates[0])).
//Aslo the .isAfter or isBefore cannot be used without the moment() fxn.
//Am only left with using greater or less

//useFull --- this code is correct
// const handleChange = (dates) => {
//   const date1 = dates[0].format("YYYY-MM-DD");
//   const date2 = dates[1].format("YYYY-MM-DD");
//   console.log(dates[0].format("YYYY-MM-DD") > dates[1].format("YYYY-MM-DD"));
// };

///code for trial

//  const bool = moment('2023-02-01').isAfter(moment('2023-01-29')); //date should be in this format. was getting .isAfter is not a function because i was including .format()
// console.log(bool);

// const handleChange = (dates) => {
//   const date1 = moment(dates[0]).format("YYYY-MM-DD");
//   const date2 = moment(dates[1]).format("YYYY-MM-DD");
//   console.log(moment(dates[0]).format("YYYY-MM-DD"));
// };
