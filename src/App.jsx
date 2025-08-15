
import Footer from "./web_components/footer/Footer";
import Header from "./web_components/header/Header";
import { useState } from "react";
function App() {

  const [name, setName] = useState("");

  const [OT, setOT] = useState({
    fri: "",
    sat: "",
    sun: "",
    mon: "",
    tue: "",
    wed: "",
    thu: "",
  });

  const [dayEquiv, setEquiv] = useState({
    fri: "",
    sat: "",
    sun: "",
    mon: "",
    tue: "",
    wed: "",
    thu: "",
  });

  const [hours, setHour] = useState({
    friHour: "",
    satHour: "",
    sunHour: "",
    monHour: "",
    tueHour: "",
    wedHour: "",
    thuHour: ""
  });
  const [times, setTimes] = useState({
      friIn: "",
      friOut: "",
      satIn: "",
      satOut: "",
      sunIn: "",
      sunOut: "",
      monIn: "",
      monOut: "",
      tueIn: "",
      tueOut: "",
      wedIn: "",
      wedOut: "",
      thuIn: "",
      thuOut: ""
  });

  
  const handleTime = (e) =>{
    const{id , value} = e.target;
    setTimes((prev) => ({
      ...prev,
      [id]: value
    }));
  };
  
  
  const calculateHours = () =>{
    const hoursBetween = (time1, time2) =>{

      if(!time1 || !time2) return 0;
      let [h1 , m1] = time1.split(":").map(Number); // for in
      let [h2 , m2] = time2.split(":").map(Number); // for out

      let min1 = h1 * 60 +m1;
      let min2 = h2 * 60 +m2;

      let timeDiff = min2 - min1;

      if(timeDiff < 0) timeDiff  += 24 * 60;
      return timeDiff / 60;
    }

    setHour((prev) =>({
      ...prev,
      friHour : hoursBetween(times.friIn, times.friOut),
      satHour : hoursBetween(times.satIn, times.satOut),
      sunHour : hoursBetween(times.sunIn, times.sunOut),
      monHour : hoursBetween(times.monIn, times.monOut),
      tueHour : hoursBetween(times.tueIn, times.tueOut),
      wedHour : hoursBetween(times.wedIn, times.wedOut),
      thuHour : hoursBetween(times.thuIn, times.thuOut),

      }));

    const calculateDayEquiv = (hours) =>{
      if(hours >= 9) return 1;
      else if (hours < 9) return 0;
      else return 0;
    }

    setEquiv((prev) =>({
      ...prev,
      fri: calculateDayEquiv(parseInt(hours.friHour)),
      sat: calculateDayEquiv(parseInt(hours.satHour)),
      sun: calculateDayEquiv(parseInt(hours.sunHour)),
      mon: calculateDayEquiv(parseInt(hours.monHour)),
      tue: calculateDayEquiv(parseInt(hours.tueHour)),
      wed: calculateDayEquiv(parseInt(hours.wedHour)),
      thu: calculateDayEquiv(parseInt(hours.thuHour)),
    })) ;

    const calculateOT = (hours) =>{
      if(!hours) return 0;

      let OThours = parseInt(hours)  - 9;
      return OThours;
    };

    setOT((prev) =>({
      ...prev,
      fri: calculateOT(parseInt(hours.friHour)),
      sat: calculateOT(parseInt(hours.satHour)),
      sun: calculateOT(parseInt(hours.sunHour)),
      mon: calculateOT(parseInt(hours.monHour)),
      tue: calculateOT(parseInt(hours.tueHour)),
      wed: calculateOT(parseInt(hours.wedHour)),
      thu: calculateOT(parseInt(hours.thuHour)),
    }));

    
    
  }

  const clear = () =>{
    setName("");
    setTimes("");
    setHour("");
    setEquiv("");
    setOT("");
  }

  const totalHours = Object.values(hours).reduce((sum, h) => sum + h, 0);
    const totalDayEquiv = Object.values(dayEquiv).reduce((sum, h) => sum + h, 0);
    const totalOTHours = Object.values(OT).reduce((sum, h) => sum + h, 0);

  return (
    <>
      <Header/>
      <main>
        <div className="table-container">
        <form>
          <label id="name-label">Name:</label>
          <input type="text" id="name-input" required onChange={(e) => setName(e.target.value)}/>

          <table>
            <thead>
              <tr>
                <th>Day</th>
                <th>Timed in</th>
                <th>Timed out</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Friday</td>
                <td><input type="time" name="friIn" id="friIn" onChange={handleTime}/></td>
                <td><input type="time" name="friOut" id="friOut" onChange={handleTime}/></td>
              </tr>
              <tr>
                <td>Saturday</td>
                <td><input type="time" name="satIn" id="satIn" onChange={handleTime}/></td>
                <td><input type="time" name="satOut" id="satOut" onChange={handleTime}/></td>
              </tr>
              <tr>
                <td>Sunday</td>
                <td><input type="time" name="sunIn" id="sunIn" onChange={handleTime}/></td>
                <td><input type="time" name="sunOut" id="sunOut" onChange={handleTime}/></td>
              </tr>
              <tr>
                <td>Monday</td>
                <td><input type="time" name="monIn" id="monIn" onChange={handleTime}/></td>
                <td><input type="time" name="monOut" id="monOut" onChange={handleTime}/></td>
              </tr>
              <tr>
                <td>Tuesday</td>
                <td><input type="time" name="tueIn" id="tueIn" onChange={handleTime}/></td>
                <td><input type="time" name="tueOut" id="tueOut" onChange={handleTime}/></td>
              </tr>
              <tr>
                <td>Wednesday</td>
                <td><input type="time" name="wedIn" id="wedIn" onChange={handleTime}/></td>
                <td><input type="time" name="wedOut" id="wedOut" onChange={handleTime}/></td>
              </tr>
              <tr>
                <td>Thursday</td>
                <td><input type="time" name="thuIn" id="thuIn" onChange={handleTime}/></td>
                <td><input type="time" name="thuOut" id="thuOut" onChange={handleTime}/></td>  
              </tr>

              

            </tbody>
          </table>
          <input type="button" value="Calculate" id="calculate-button" onClick={calculateHours}/>
          <input type="reset" value="Clear" id="clear-button" onClick={clear}/>
          </form>
      </div>
      
      <div className="summary-container">
          <h1>Summary of info</h1>
          <h3>Name: {name}</h3>
        <table>
          <thead>
            <tr>
              <th>Day</th>
              <th>Total Hours</th>
              <th>Day Equiv</th>
              <th>OT</th>
            </tr>
          </thead>
          <tbody>
            
            <tr>
              <td>Friday</td>
              <td>{hours.friHour}</td>
              <td>{dayEquiv.fri}</td>
              <td>{OT.fri}</td>
            </tr>
            <tr>
              <td>Saturday</td>
              <td>{hours.satHour}</td>
              <td>{dayEquiv.sat}</td>
              <td>{OT.sat}</td>
            </tr>
            <tr>
              <td>Sunday</td>
              <td>{hours.sunHour}</td>
              <td>{dayEquiv.sun}</td>
              <td>{OT.sun}</td>
            </tr>
            <tr>
              <td>Monday</td>
              <td>{hours.monHour}</td>
              <td>{dayEquiv.mon}</td>
              <td>{OT.mon}</td>
            </tr>
            <tr>
              <td>Tuesday</td>
              <td>{hours.tueHour}</td>
              <td>{dayEquiv.tue}</td>
              <td>{OT.tue}</td>
            </tr>
            <tr>
              <td>Wednesday</td>
              <td>{hours.wedHour}</td>
              <td>{dayEquiv.wed}</td>
              <td>{OT.wed}</td>
            </tr>
            <tr>
              <td>Thursday</td>
              <td>{hours.thuHour}</td>
              <td>{dayEquiv.thu}</td>
              <td>{OT.thu}</td>  
            </tr>
            <tr>
              <td>Total</td>
              <td>{!totalHours  ? 'no record' : totalHours}</td>
              <td>{!totalDayEquiv ? 'no record' : totalDayEquiv}</td>
              <td>{!totalOTHours ? 'no record' : totalOTHours}</td>
            </tr>
          </tbody>
        </table>
      </div>
      </main>
      <Footer/>
    </>
  )
}

export default App
