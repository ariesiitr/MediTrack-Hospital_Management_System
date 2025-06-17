import React, { useEffect, useState } from "react";
import styles from "./Prescription.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import PrescriptionForm from "./PresrciptionForm.jsx"; 
import API_BASE_URL from '../apiConfig';


function Prescription() {
    const [doctors, setDoctors] = useState([]);
    const [patient, setPatient] = useState([]);
    const [selectedDoctor, setIsSelectedDoctor] = useState('');
    const [selectedPatientRegId, setSelectedPatientRegId] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let res1 = await fetch(`${API_BASE_URL}/doctor`);
                let res2 = await fetch(`${API_BASE_URL}/fetchLatestRegPatient`);
                if (res1.ok && res2.ok) {
                    let data1 = await res1.json();
                    let data2 = await res2.json();
                    setDoctors(data1);
                    setPatient(data2);
                } else {
                    console.log("Res is not ok");
                }
            } catch (err) {
                console.error("Error is ", err);
            }
        };
        fetchData();
    }, []);

    const searchData = () => {
        if (selectedDoctor && selectedPatientRegId && selectedDate) {
            setShowForm(true);
        } else {
            alert("Please select doctor, patient, and date");
            setShowForm(false);
        }
    };

    return (
        <div className="ml-[20%]">
            <div>
                <div className={styles["items"]}>
                    <select
                        value={selectedDoctor}
                        onChange={(e) => setIsSelectedDoctor(e.target.value)}
                        className={styles["select-dropdown"]}
                    >
                        <option value="" disabled>Select doctor</option>
                        {doctors.map((doctor) => (
                            <option value={doctor.doc_id} key={doctor.doc_id}>{doctor.name}</option>
                        ))}
                    </select>

                    <select
                        value={selectedPatientRegId}
                        onChange={(e) => setSelectedPatientRegId(e.target.value)}
                        className={styles["select-dropdown"]}
                    >
                        <option value="" disabled>Select patient</option>
                        {patient.map((pat) => (
                            <option value={pat.reg_id} key={pat.reg_id}>{pat.name}</option>
                        ))}
                    </select>

                    <input
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        type='date'
                        placeholder="Enter prescription date"
                    />

                    <button type='button' onClick={searchData}>
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </button>
                </div>
            </div>

            {showForm && <PrescriptionForm selectedDoctor = {selectedDoctor} selectedDate = {selectedDate} selectedPatientRegId = {selectedPatientRegId} />} 
        </div>
    );
}

export default Prescription;
