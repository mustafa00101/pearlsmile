import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import "./AdminDashboard.css";

export default function AdminDashboard({ user, onLogout }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  async function loadAppointments() {
    setLoading(true);

    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading appointments:", error);
    } else {
      setAppointments(data || []);
    }

    setLoading(false);
  }

  async function updateStatus(id, newStatus) {
  const { error } = await supabase
    .from("appointments")
    .update({
      status: newStatus,
    })
    .eq("id", id);

  if (error) {
    console.error("Error updating appointment:", error);
    return;
  }

  await loadAppointments();
}
  
  useEffect(() => {
    loadAppointments();
  }, []);

  const filteredAppointments = appointments.filter((appointment) => {
  const search = searchTerm.toLowerCase();

  const matchesSearch =
    appointment.patient_name?.toLowerCase().includes(search) ||
    appointment.phone?.toLowerCase().includes(search) ||
    appointment.email?.toLowerCase().includes(search);

  const matchesStatus =
    statusFilter === "All" ||
    appointment.status === statusFilter;

 const today = new Date();

const todayString =
  today.getFullYear() +
  "-" +
  String(today.getMonth() + 1).padStart(2, "0") +
  "-" +
  String(today.getDate()).padStart(2, "0");

const appointmentDate = appointment.appointment_date;

const matchesDate =
  dateFilter === "All" ||
  (dateFilter === "Today" &&
    appointmentDate === todayString) ||
  (dateFilter === "Upcoming" &&
    appointmentDate >= todayString) ||
  (dateFilter === "Past" &&
    appointmentDate < todayString);

  return matchesSearch && matchesStatus && matchesDate;
});

  const pending = appointments.filter(
    (appointment) => appointment.status === "Pending"
  ).length;
  const confirmed = appointments.filter(
  (appointment) => appointment.status === "Confirmed"
).length;

const completed = appointments.filter(
  (appointment) => appointment.status === "Completed"
).length;

const cancelled = appointments.filter(
  (appointment) => appointment.status === "Cancelled"
).length;

  return (
    <div className="admin-dashboard">

      <header className="admin-header">

        <div>
          <div className="admin-brand">
            <span>✦</span> PearlSmile
          </div>

          <p>Clinic Administration</p>
        </div>

        <div className="admin-user">

          <span>
            {user?.email}
          </span>

          <button onClick={onLogout}>
            Logout
          </button>

        </div>

      </header>


      <main className="admin-main">

        <div className="dashboard-heading">

          <div>
            <p className="admin-label">
              DASHBOARD
            </p>

            <h1>
              Appointments
            </h1>
          </div>

          <button
            className="refresh-button"
            onClick={loadAppointments}
          >
            ↻ Refresh
          </button>

        </div>


        <section>
          <div className="stats-grid">

  <div className="stat-card">
    <span className="stat-label">
      Total Appointments
    </span>

    <strong className="stat-number">
      {appointments.length}
    </strong>
  </div>


  <div className="stat-card">
    <span className="stat-label">
      Pending
    </span>

    <strong className="stat-number">
      {pending}
    </strong>
  </div>


  <div className="stat-card">
    <span className="stat-label">
      Confirmed
    </span>

    <strong className="stat-number">
      {confirmed}
    </strong>
  </div>


  <div className="stat-card">
    <span className="stat-label">
      Completed
    </span>

    <strong className="stat-number">
      {completed}
    </strong>
  </div>


  <div className="stat-card">
    <span className="stat-label">
      Cancelled
    </span>

    <strong className="stat-number">
      {cancelled}
    </strong>
  </div>

</div>

        </section>


        <section className="appointments-card">

          <div className="appointments-header">

  <div className="appointments-title">
    <h2>
      Recent Appointments
    </h2>

    <span>
      {filteredAppointments.length} of {appointments.length} records
    </span>
  </div>

  <div className="appointment-controls">

    <input
      type="text"
      className="appointment-search"
      placeholder="Search patient, phone or email..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />

    <select
      className="appointment-filter"
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value)}
    >
      <option value="All">All Status</option>
      <option value="Pending">Pending</option>
      <option value="Confirmed">Confirmed</option>
      <option value="Cancelled">Cancelled</option>
      <option value="Completed">Completed</option>
    </select>
    <select
      className="appointment-filter"
      value={dateFilter}
      onChange={(e) => setDateFilter(e.target.value)}
    >
      <option value="All">All Dates</option>
      <option value="Today">Today</option>
      <option value="Upcoming">Upcoming</option>
      <option value="Past">Past</option>
    </select>

  </div>

</div>


          {loading ? (

            <div className="dashboard-message">
              Loading appointments...
            </div>

          ) : appointments.length === 0 ? (

            <div className="dashboard-message">
              No appointments found.
            </div>

          ) : (

            <div className="appointments-table-wrapper">

              <table className="appointments-table">

                <thead>

                  <tr>
                    <th>Patient</th>
                    <th>Phone</th>
                    <th>Service</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                  </tr>

                </thead>

                <tbody>

                  {filteredAppointments.map((appointment) => (

                    <tr
                        key={appointment.id}
                        className="appointment-row"
                        onClick={() => setSelectedAppointment(appointment)}
                      >
                      <td>
                        {appointment.patient_name}
                      </td>

                      <td>
                        {appointment.phone}
                      </td>

                      <td>
                        {appointment.service}
                      </td>

                      <td>
                        {appointment.appointment_date}
                      </td>

                      <td>
                        {appointment.appointment_time}
                      </td>

                      <td>
                      <div className="appointment-actions">

                        <span
                          className={`status ${appointment.status?.toLowerCase()}`}
                        >
                          {appointment.status}
                        </span>

                        {appointment.status === "Pending" && (
                          <>
                            <button
                              className="confirm-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                updateStatus(appointment.id, "Confirmed");
                              }}
                            >
                              Confirm
                            </button>

                            <button
                              className="cancel-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                updateStatus(appointment.id, "Cancelled");
                              }}
                            >
                              Cancel
                            </button>
                          </>
                        )}

                      </div>
                    </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </section>
        </main>

        {selectedAppointment && (
  <div
    className="appointment-modal-overlay"
    onClick={() => setSelectedAppointment(null)}
  >

    <div
      className="appointment-modal"
      onClick={(e) => e.stopPropagation()}
    >

      <div className="appointment-modal-header">

        <div>
          <p className="admin-label">
            APPOINTMENT DETAILS
          </p>

          <h2>
            {selectedAppointment.patient_name}
          </h2>
        </div>

        <button
          className="modal-close"
          onClick={() => setSelectedAppointment(null)}
        >
          ×
        </button>

      </div>


      <div className="appointment-detail-grid">

        <div className="detail-item">
          <span>Phone</span>
          <strong>
            {selectedAppointment.phone || "Not provided"}
          </strong>
        </div>


        <div className="detail-item">
          <span>Email</span>
          <strong>
            {selectedAppointment.email || "Not provided"}
          </strong>
        </div>


        <div className="detail-item">
          <span>Service</span>
          <strong>
            {selectedAppointment.service || "Not provided"}
          </strong>
        </div>


        <div className="detail-item">
          <span>Date</span>
          <strong>
            {selectedAppointment.appointment_date || "Not provided"}
          </strong>
        </div>


        <div className="detail-item">
          <span>Time</span>
          <strong>
            {selectedAppointment.appointment_time || "Not provided"}
          </strong>
        </div>


        <div className="detail-item">
          <span>Status</span>

          <span
            className={`status ${selectedAppointment.status?.toLowerCase()}`}
          >
            {selectedAppointment.status}
          </span>
        </div>

      </div>


      <div className="detail-message">

        <span>Patient Message</span>

        <p>
          {selectedAppointment.message ||
            "No message provided."}
        </p>

      </div>


      <div className="modal-actions">

        {selectedAppointment.status === "Pending" && (
          <>
            <button
              className="confirm-btn"
              onClick={() => {
                updateStatus(
                  selectedAppointment.id,
                  "Confirmed"
                );

                setSelectedAppointment({
                  ...selectedAppointment,
                  status: "Confirmed",
                });
              }}
            >
              Confirm Appointment
            </button>

            <button
              className="cancel-btn"
              onClick={() => {
                updateStatus(
                  selectedAppointment.id,
                  "Cancelled"
                );

                setSelectedAppointment({
                  ...selectedAppointment,
                  status: "Cancelled",
                });
              }}
            >
              Cancel Appointment
            </button>
          </>
        )}
                {selectedAppointment.status === "Confirmed" && (
                  <button
                    className="complete-btn"
                    onClick={() => {
                      updateStatus(
                        selectedAppointment.id,
                        "Completed"
                      );

                      setSelectedAppointment({
                        ...selectedAppointment,
                        status: "Completed",
                      });
                    }}
                  >
                    Mark as Completed
                  </button>
                )}
              

      </div>

    </div>

  </div>
)}

      

    </div>
  );
}