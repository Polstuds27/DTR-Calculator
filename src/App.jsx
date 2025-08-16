
import Footer from "./web_components/footer/Footer";
import Header from "./web_components/header/Header";
import {  useEffect, useRef, useState } from "react";
import * as XLSX from "xlsx";
function App() {

  const [inputName, setName] = useState("");
  const [startDay, setStartDay] = useState("");
  const [endDay, setEndDay] = useState("");

    const [data, setData] = useState([]);

    const handleNames = () =>{
      if(!inputName.trim()) return 0;

      const add = {
        id: Date.now(),
        name: inputName,
      };

      setData([...data, add]);
      setName("");
    } 

    const resetName = () =>{
      setData([]);
    }

  const [OT, setOT] = useState({
    fri: "",
    sat: "",
    sun: "",
    mon: "",
    tue: "",
    wed: "",
    thuNew: "",
    thuOld: "",
  });

  const [dayEquiv, setEquiv] = useState({
    fri: "",
    sat: "",
    sun: "",
    mon: "",
    tue: "",
    wed: "",
    thuNew: "",
    thuOld: "",
  });

  const [hours, setHour] = useState({
    friHour: "",
    satHour: "",
    sunHour: "",
    monHour: "",
    tueHour: "",
    wedHour: "",
    thuOldHour: "",
    thuNewHour: ""
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
      thuOldIn: "",
      thuOldOut: "",
      thuNewIn: "",
      thuNewOut: ""
  });

  
  const handleTime = (e) =>{
    const{id , value} = e.target;
    setTimes((prev) => ({
      ...prev,
      [id]: value
    }));
  };

  useEffect(()=>{

    const calculateDayEquiv = (hours) =>{
      if(hours >= 9) return 1;
      else if (hours < 9 && hours > 0) return 0.5;
      else return 0;
    }

    const calculateOT = (hours) =>{
      if(hours > 9) return parseFloat((hours-=9).toFixed(1));
      else if(hours < 9) return 0;
      else return 0;
    };

    setEquiv((prev) =>({
      ...prev,
      fri: calculateDayEquiv(hours.friHour),
      sat: calculateDayEquiv(hours.satHour),
      sun: calculateDayEquiv(hours.sunHour),
      mon: calculateDayEquiv(hours.monHour),
      tue: calculateDayEquiv(hours.tueHour),
      wed: calculateDayEquiv(hours.wedHour),
      thuNew: calculateDayEquiv(hours.thuNewHour),
      thuOld: calculateDayEquiv(hours.thuOldHour),
    })) ;

    setOT((prev) =>({
      ...prev,
      fri: calculateOT(hours.friHour),
      sat: calculateOT(hours.satHour),
      sun: calculateOT(hours.sunHour),
      mon: calculateOT(hours.monHour),
      tue: calculateOT(hours.tueHour),
      wed: calculateOT(hours.wedHour),
      thuNew: calculateOT(hours.thuNewHour),
      thuOld: calculateOT(hours.thuOldHour),
    }));

  }, [hours]);
  
  
  const calculateHours = () =>{
    const hoursBetween = (time1, time2) =>{

      if(!time1 || !time2) return 0;
      if(time1 === time2) return 12;
      let [h1 , m1] = time1.split(":").map(Number); // for in
      let [h2 , m2] = time2.split(":").map(Number); // for out

      let min1 = h1 * 60 +m1;
      let min2 = h2 * 60 +m2;

      let timeDiff = parseFloat(min2.toFixed(1)) - parseFloat(min1.toFixed(1));

      if(timeDiff < 0) timeDiff  += 24 * 60;
      return timeDiff / 60;
    }


    setHour((prev) =>({
      ...prev,
      friHour : hoursBetween(times.friIn, times.friOut) || 0,
      satHour : hoursBetween(times.satIn, times.satOut) || 0,
      sunHour : hoursBetween(times.sunIn, times.sunOut) || 0,
      monHour : hoursBetween(times.monIn, times.monOut) || 0,
      tueHour : hoursBetween(times.tueIn, times.tueOut) || 0,
      wedHour : hoursBetween(times.wedIn, times.wedOut) || 0,
      thuOldHour : hoursBetween(times.thuOldIn, times.thuOldOut) || 0,
      thuNewHour : hoursBetween(times.thuNewIn, times.thuNewOut) || 0,
      }));

    }

  const clear = () =>{
    setTimes("");
    setHour("");
    setEquiv("");
    setOT("");
    setData([]);
  }

  let trackId = useRef(0);
  const [dtrList, setDtrList] = useState([]);
  
  const saveData = () =>{
    const tempList = [];

    for(let i = 0; i < data.length; i++){
      trackId.current++;
    const dtrData = {
      id: trackId.current,
      name: data[i].name,
      friEquiv: dayEquiv.fri,
      friOT: OT.fri,
      satEquiv: dayEquiv.sat,
      satOT: OT.sat,
      sunEquiv: dayEquiv.sun,
      sunOT: OT.sun,
      monEquiv: dayEquiv.mon,
      monOT: OT.mon,
      tueEquiv: dayEquiv.tue,
      tueOT: OT.tue,
      wedEquiv: dayEquiv.wed,
      wedOT: OT.wed,
      thuEquiv: dayEquiv.thuNew,
      thuOT: OT.thuOld,
      Total_OT: totalOTHours,
      Total_Days: totalDayEquiv,

    }
      tempList.push(dtrData);
    }
    setDtrList((prevList) => [...prevList, ...tempList]);
  } 

  const days = [];
  const trackDays = (start, end) =>{
    
    const current = new Date(start);

    while(current <= new Date(end)){

    const format = (current.getMonth() + 1).toString().padStart(2,"0") + "/" + current.getDate().toString().padStart(2, "0");
    
    days.push(format);

    current.setDate(current.getDate() + 1);
    }
    
  }

  const download = () =>{

    if(dtrList.length === 0){
      alert("No Data");
      return;
    }

   const headers = [
  "id","name",
  "friEquiv","friOT","satEquiv","satOT","sunEquiv","sunOT",
  "monEquiv","monOT","tueEquiv","tueOT","wedEquiv","wedOT",
  "thuEquiv","thuOT",
  "Total_Days","Total_OT"
];

  let workSheet = XLSX.utils.json_to_sheet(dtrList, { header: headers });

  XLSX.utils.sheet_add_aoa(workSheet, [[
    "ID","Employees",
    `Fri ${days[1]}`, "Fri (OT)",
    `Sat ${days[2]}`, "Sat (OT)",
    `Sun ${days[3]}`, "Sun (OT)",
    `Mon ${days[4]}`, "Mon (OT)",
    `Tue ${days[5]}`, "Tue (OT)",
    `Wed ${days[6]}`, "Wed (OT)",
    `Thu ${days[7]}`, `Thu (OT ${days[0]})`,
    "Total Days","Total OT"
  ]], { origin: "A1" });

    let fileName = "Worker's Dtr" + startDay + "-" + endDay + ".xlsx";

    const workBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, "Worker's Dtr" );


    XLSX.writeFile(workBook,fileName);

    trackId.current = 0;
    setDtrList([]);
  }

   const excludeDayEquiv = "thuOld";
  const excludeOt = "thuNew";

  const totalHours = Object.values(hours).reduce((sum, h) => sum + h, 0);

  const totalDayEquiv = Object.entries(dayEquiv)
  .filter(([key]) => key !== excludeDayEquiv)
  .reduce((sum, [, value]) => sum + value, 0); // ignore first element


  const totalOTHours = Object.entries(OT)
  .filter(([key]) => key !== excludeOt)
  .reduce((sum, [, value]) => sum + value, 0);

  return (
    <>
      <Header/>
      <main>

      <div className="name-container">
        <form>
          <label id="name-label">Name:</label>
          <input type="text" name="name-input" id="name-input" required onChange={(e) => setName(e.target.value)} 
          value={inputName} onKeyDown={(e) => {
            if(e.key === "Enter"){
              handleNames();
            }
          }}/>
          <input type="button" value="Add" onClick={handleNames}/>
          <input type="button" value="Reset" onClick={resetName}/>
          
        </form>

        <table>
          <thead>
            <tr>
              <th>Names</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item)=>(
              <tr key={item.id}>
                <td>{item.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      <br />
      <div className="input-container">
        <div className="table-container">
        <form>
          <label htmlFor="" id="start-label">Start Day: </label>
         <input type="date" name="start-date" id="start-date" required onChange={(e) => setStartDay(e.target.value)}/>
         <br />
         <label htmlFor="" id="end-label">End Day: </label>
          <input type="date" name="end-date" id="end-date" required onChange={(e) => setEndDay(e.target.value)}/>
          {trackDays(startDay,endDay)}

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
                <td>{days[0]}</td>
                <td><input type="time" name="thuOldIn" id="thuOldIn" onChange={handleTime}/></td>
                <td><input type="time" name="thuOldOut" id="thuOldOut" onChange={handleTime}/></td>  
              </tr>
              <tr>
                <td>{days[1]} </td>
                <td><input type="time" name="friIn" id="friIn" onChange={handleTime}/></td>
                <td><input type="time" name="friOut" id="friOut" onChange={handleTime}/></td>
              </tr>
              <tr>
                <td>{days[2]} </td>
                <td><input type="time" name="satIn" id="satIn" onChange={handleTime}/></td>
                <td><input type="time" name="satOut" id="satOut" onChange={handleTime}/></td>
              </tr>
              <tr>
                <td>{days[3]} </td>
                <td><input type="time" name="sunIn" id="sunIn" onChange={handleTime}/></td>
                <td><input type="time" name="sunOut" id="sunOut" onChange={handleTime}/></td>
              </tr>
              <tr>
                <td>{days[4]} </td>
                <td><input type="time" name="monIn" id="monIn" onChange={handleTime}/></td>
                <td><input type="time" name="monOut" id="monOut" onChange={handleTime}/></td>
              </tr>
              <tr>
                <td>{days[5]} </td>
                <td><input type="time" name="tueIn" id="tueIn" onChange={handleTime}/></td>
                <td><input type="time" name="tueOut" id="tueOut" onChange={handleTime}/></td>
              </tr>
              <tr>
                <td>{days[6]} </td>
                <td><input type="time" name="wedIn" id="wedIn" onChange={handleTime}/></td>
                <td><input type="time" name="wedOut" id="wedOut" onChange={handleTime}/></td>
              </tr>
              <tr>
                <td>{days[7]} </td>
                <td><input type="time" name="thuNewIn" id="thuNewIn" onChange={handleTime}/></td>
                <td><input type="time" name="thuNewOut" id="thuNewOut" onChange={handleTime}/></td>  
              </tr>

            </tbody>
          </table>
          <input type="button" value="Calculate" id="calculate-button" onClick={calculateHours}/>
          <input type="reset" value="Clear" id="clear-button" onClick={clear}/>
          <input type="button" value="Save" id="save-button" onClick={saveData}/>
          </form>
      </div>
      
      <div className="summary-container">
          <h1>Summary of info</h1>
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
              <td>{days[0]}</td>
              <td>{hours.thuOldHour}</td>
              <td>{dayEquiv.thuOld}</td>
              <td>{OT.thuOld}</td>  
            </tr>
            <tr>
              <td>{days[1]}</td>
              <td>{hours.friHour}</td>
              <td>{dayEquiv.fri}</td>
              <td>{OT.fri}</td>
            </tr>
            <tr>
              <td>{days[2]}</td>
              <td>{hours.satHour}</td>
              <td>{dayEquiv.sat}</td>
              <td>{OT.sat}</td>
            </tr>
            <tr>
              <td>{days[3]}</td>
              <td>{hours.sunHour}</td>
              <td>{dayEquiv.sun}</td>
              <td>{OT.sun}</td>
            </tr>
            <tr>
              <td>{days[4]}</td>
              <td>{hours.monHour}</td>
              <td>{dayEquiv.mon}</td>
              <td>{OT.mon}</td>
            </tr>
            <tr>
              <td>{days[5]}</td>
              <td>{hours.tueHour}</td>
              <td>{dayEquiv.tue}</td>
              <td>{OT.tue}</td>
            </tr>
            <tr>
              <td>{days[6]}</td>
              <td>{hours.wedHour}</td>
              <td>{dayEquiv.wed}</td>
              <td>{OT.wed}</td>
            </tr>
            <tr>
              <td>{days[7]}</td>
              <td>{hours.thuNewHour}</td>
              <td>{dayEquiv.thuNew}</td>
              <td>{OT.thuNew}</td>  
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
      </div>  

      <div className="preview-container">
        <button value="Download" id="download-button"onClick={download}>Download</button>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Fri {days[1]}</th>
              <th>Fri (OT)</th>
              <th>Sat {days[2]}</th>
              <th>Sat (OT)</th>
              <th>Sun {days[3]}</th>
              <th>Sun (OT)</th>
              <th>Mon {days[4]}</th>
              <th>Mon (OT)</th>
              <th>Tue {days[5]}</th>
              <th>Tue (OT)</th>
              <th>Wed {days[6]}</th>
              <th>Wed (OT)</th>
              <th>Thu {days[7]}</th>
              <th>Thu (OT {days[0]})</th>
              <th>Total OT</th>
              <th>Total Days</th>
            </tr>
          </thead>
          <tbody>
            {dtrList.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.friEquiv}</td>
                <td>{item.friOT}</td>
                <td>{item.satEquiv}</td>
                <td>{item.satOT}</td>
                <td>{item.sunEquiv}</td>
                <td>{item.sunOT}</td>
                <td>{item.monEquiv}</td>
                <td>{item.monOT}</td>
                <td>{item.tueEquiv}</td>
                <td>{item.tueOT}</td>
                <td>{item.wedEquiv}</td>
                <td>{item.wedOT}</td>
                <td>{item.thuEquiv}</td>
                <td>{item.thuOT}</td>
                <td>{item.Total_OT}</td>
                <td>{item.Total_Days}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </main>
      <Footer/>
    </>
  )
}

export default App
