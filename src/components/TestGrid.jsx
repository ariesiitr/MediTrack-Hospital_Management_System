import React, { useEffect, useState } from "react";
import styles from "./TestGrid.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faP, faPlus } from "@fortawesome/free-solid-svg-icons";
import deleteIcon from "../images/delete-icon.png";
import API_BASE_URL from '../apiConfig';

function TestGrid({ regId }) {
  const [inHouseDoctor, setInHouseDoctor] = useState([]);
  const [tests, setTests] = useState([]);
  const [testDate,setTestDate] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [test_id,setTest_id] = useState('');
  const [doc_id,setDoc_id] = useState('');
  const [errorMessage,setErrorMessage] = useState('');
  const [regStatus , setRegStatus] = useState('');

  useEffect(() => {
    const resetData = () => {
      setRows([]);
    };
    resetData();
  },[regId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const doctorRes = await fetch(`${API_BASE_URL}/fetchInHouseDoctors`);
        const testRes = await fetch(`${API_BASE_URL}/fetchTests`);
        const regStatusRes = await fetch(`${API_BASE_URL}/regStatus?regId=${regId}`);
        const regData = await regStatusRes.json();

        const doctors = await doctorRes.json();
        const testsData = await testRes.json();

        if (doctorRes.ok && testRes.ok) {
          setInHouseDoctor(doctors);
          setTests(testsData);
          setRegStatus(regData[0].reg_status);
          console.log(inHouseDoctor);
          console.log(testsData);
          console.log("Doctors and Tests fetched successfully");
        } else {
          console.log("Error in fetching doctors or tests");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [regId]);

  const addRow = () => {
    if (inHouseDoctor.length === 0 || tests.length === 0) {
      alert("Data not loaded yet. Please wait...");
      return;
    }

    setRows([
      ...rows,
      {
        doctor: null,
        test: null,
      },
    ]);
  };

  const deleteRow = (index) => {
    const updated = [...rows];
    updated.splice(index, 1);
    setRows(updated);
  };

  const updateRow = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
  };

const saveData = async () => {
  const token = localStorage.getItem('token');
  console.log("Token is ",token);
  try {
    const response = await fetch(`${API_BASE_URL}/saveTestGridData`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ regId, rows ,testDate}),
    });

    const result = await response.json();

    if (response.ok) {
      setRows([]);
    } else {
      setErrorMessage(result.message)
    }
  } catch (err) {
    console.error("Save error:", err);
    alert("Failed to save data. See console for details.");
  }
};


   return (
    <div>
      {regStatus === "D" ? (
        <div>
          <h1 className="text-center block">Patient discharged</h1>
        </div>
      ) : (
        <div>
          {errorMessage && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded w-72 text-center mb-4 mx-auto block">
              {errorMessage}
            </div>
          )}

          <div className={styles["title-icon"]}>
            <h2 className="mx-auto bold text-center pb-4">Test for Patient Id : {regId}</h2>
            <button>
              <FontAwesomeIcon
                icon={faPlus}
                onClick={addRow}
                disabled={loading}
                className={styles["title-icon-i"]}
              />
            </button>
          </div>

          {rows.length > 0 && (
            <div>
              <table border="1" cellPadding="10" style={{ borderCollapse: "collapse", width: "100%" }} className={`${styles["table"]}`}>
                <thead className="bg-gray-100">
                  <tr>
                    <th>Test Date</th>
                    <th>Doctor Name</th>
                    <th>Test Name</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, idx) => (
                    <tr key={idx}>
                      <td>
                        <input
                          type="date"
                          value={row.testDate}
                          onChange={(e) => updateRow(idx, "testDate", e.target.value)}
                        />
                      </td>
                      <td>
                        <select
                          value={row.doctor?.doc_id || ""}
                          onChange={(e) => {
                            const selectedDoc = inHouseDoctor.find(
                              (doc) => doc.doc_id.toString() === e.target.value
                            );
                            updateRow(idx, "doctor", selectedDoc);
                          }}
                        >
                          <option value="" disabled hidden>Select Doctor</option>
                          {inHouseDoctor.map((doc, i) => (
                            <option key={i} value={doc.doc_id}>
                              {doc.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <select
                          value={row.test?.test_id || ""}
                          onChange={(e) => {
                            const selectedTest = tests.find(
                              (t) => t.test_id.toString() === e.target.value
                            );
                            updateRow(idx, "test", selectedTest);
                          }}
                        >
                          <option value="" disabled hidden>Select Test</option>
                          {tests.map((t, i) => (
                            <option key={i} value={t.test_id}>
                              {t.test_name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <button onClick={() => deleteRow(idx)} className={styles["delete-btn-test"]}>
                          <img src={deleteIcon} alt="delete" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <br />
              <div className={styles["buttons"]}>
                <button onClick={saveData} disabled={rows.length === 0} className={styles["save-btn"]}>
                  Save
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default TestGrid;