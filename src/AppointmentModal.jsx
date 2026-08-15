import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import "./AppointmentModal.css";

const TIME_SLOTS = [
  ["09:00", "09:00 AM – 10:00 AM"],
  ["10:00", "10:00 AM – 11:00 AM"],
  ["11:00", "11:00 AM – 12:00 PM"],
  ["12:00", "12:00 PM – 01:00 PM"],
  ["13:00", "01:00 PM – 02:00 PM"],
  ["14:00", "02:00 PM – 03:00 PM"],
  ["15:00", "03:00 PM – 04:00 PM"],
  ["16:00", "04:00 PM – 05:00 PM"],
];

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function getTodayString() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getDateString(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(
    day
  ).padStart(2, "0")}`;
}

export default function AppointmentModal({
  buttonText = "Book Appointment",
  buttonClassName = "appointment-btn",
}) {
  const [isOpen, setIsOpen] = useState(false);

  const [formData, setFormData] = useState({
    patient_name: "",
    email: "",
    phone: "",
    appointment_date: "",
    appointment_time: "",
    service: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [bookedSlots, setBookedSlots] = useState([]);
  const [checkingSlots, setCheckingSlots] = useState(false);

  const today = new Date();

  const [calendarMonth, setCalendarMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function checkBookedSlots(date) {
    if (!date) {
      setBookedSlots([]);
      return;
    }

    setCheckingSlots(true);

    const { data, error } = await supabase
      .from("appointments")
      .select("appointment_time, status")
      .eq("appointment_date", date)
      .in("status", ["Pending", "Confirmed", "Completed"]);

    setCheckingSlots(false);

    if (error) {
      console.error("Slot check error:", error);

      setErrorMessage(
        "Unable to check appointment availability. Please try again."
      );

      return;
    }

    const slots = data.map((appointment) =>
      String(appointment.appointment_time).slice(0, 5)
    );

    setBookedSlots(slots);
  }

  useEffect(() => {
    if (formData.appointment_date) {
      checkBookedSlots(formData.appointment_date);
    } else {
      setBookedSlots([]);
    }
  }, [formData.appointment_date]);

  function isPastDate(dateString) {
    return dateString < getTodayString();
  }

  function isWeekend(year, month, day) {
    const date = new Date(year, month, day);
    const dayOfWeek = date.getDay();

    return dayOfWeek === 0 || dayOfWeek === 6;
  }

  function selectDate(dateString) {
    const selected = new Date(`${dateString}T00:00:00`);

    if (selected.getDay() === 0 || selected.getDay() === 6) {
      setErrorMessage(
        "PearlSmile is closed on Saturday and Sunday. Please select a weekday."
      );

      return;
    }

    if (isPastDate(dateString)) {
      return;
    }

    setErrorMessage("");

    setFormData((previous) => ({
      ...previous,
      appointment_date: dateString,
      appointment_time: "",
    }));
  }

  function goToPreviousMonth() {
    const currentMonthStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );

    if (calendarMonth <= currentMonthStart) {
      return;
    }

    setCalendarMonth(
      new Date(
        calendarMonth.getFullYear(),
        calendarMonth.getMonth() - 1,
        1
      )
    );
  }

  function goToNextMonth() {
    setCalendarMonth(
      new Date(
        calendarMonth.getFullYear(),
        calendarMonth.getMonth() + 1,
        1
      )
    );
  }

  function renderCalendarDays() {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();

    const firstDay = new Date(year, month, 1).getDay();

    // Convert Sunday-first JS calendar to Monday-first.
    const mondayFirstOffset = firstDay === 0 ? 6 : firstDay - 1;

    const daysInMonth = new Date(
      year,
      month + 1,
      0
    ).getDate();

    const daysInPreviousMonth = new Date(
      year,
      month,
      0
    ).getDate();

    const cells = [];

    // Previous month's days
    for (let i = mondayFirstOffset - 1; i >= 0; i--) {
      cells.push(
        <div
          key={`previous-${i}`}
          className="calendar-day muted"
        >
          {daysInPreviousMonth - i}
        </div>
      );
    }

    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = getDateString(year, month, day);

      const weekend = isWeekend(year, month, day);
      const past = isPastDate(dateString);
      const selected =
        formData.appointment_date === dateString;

      const isToday = dateString === getTodayString();

      const disabled = weekend || past;

      cells.push(
        <button
          key={dateString}
          type="button"
          className={`calendar-day ${
            selected ? "selected" : ""
          } ${isToday ? "today" : ""} ${
            weekend ? "weekend" : ""
          } ${past ? "past" : ""}`}
          disabled={disabled}
          onClick={() => selectDate(dateString)}
        >
          <span>{day}</span>

          {selected && (
            <small>•</small>
          )}
        </button>
      );
    }

    // Next month's filler days
    const remaining =
      42 - cells.length;

    for (let i = 1; i <= remaining; i++) {
      cells.push(
        <div
          key={`next-${i}`}
          className="calendar-day muted"
        >
          {i}
        </div>
      );
    }

    return cells;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);
    setSuccess(false);
    setErrorMessage("");

    const { error } = await supabase
      .from("appointments")
      .insert([
        {
          ...formData,
          status: "Pending",
        },
      ]);

    setLoading(false);

    if (error) {
      console.error("Appointment error:", error);

      if (
        error.code === "23505"
      ) {
        setErrorMessage(
          "This appointment slot was just booked by another patient. Please choose another time."
        );

        if (formData.appointment_date) {
          checkBookedSlots(
            formData.appointment_date
          );
        }

        return;
      }

      setErrorMessage(
        "Something went wrong. Please try again."
      );

      return;
    }

    setSuccess(true);

    setFormData({
      patient_name: "",
      email: "",
      phone: "",
      appointment_date: "",
      appointment_time: "",
      service: "",
      message: "",
    });

    setBookedSlots([]);
  }

  function closeModal() {
    setIsOpen(false);
    setSuccess(false);
    setErrorMessage("");
  }

  return (
    <>
      <button
        className={buttonClassName}
        onClick={() => setIsOpen(true)}
      >
        {buttonText}
      </button>

      {isOpen && (
        <div
          className="appointment-overlay"
          onClick={closeModal}
        >
          <div
            className="appointment-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <div className="appointment-header">
              <div>
                <p className="appointment-eyebrow">
                  PEARLSMILE
                </p>

                <h2>
                  Book an Appointment
                </h2>

                <p>
                  Tell us a little about your visit.
                </p>
              </div>

              <button
                className="appointment-close"
                onClick={closeModal}
              >
                ×
              </button>
            </div>

            {success ? (
              <div className="appointment-success">
                <div className="success-icon">
                  ✓
                </div>

                <h3>
                  Appointment Request Sent!
                </h3>

                <p>
                  Thank you. Your appointment
                  request has been received.
                </p>

                <p>
                  Our team will contact you to
                  confirm your appointment.
                </p>

                <button
                  className="success-button"
                  onClick={closeModal}
                >
                  Done
                </button>
              </div>
            ) : (
              <form
                className="appointment-form"
                onSubmit={handleSubmit}
              >
                {/* NAME + PHONE */}

                <div className="form-row">
                  <div className="form-group">
                    <label>
                      Full Name *
                    </label>

                    <input
                      type="text"
                      name="patient_name"
                      placeholder="Enter your name"
                      value={
                        formData.patient_name
                      }
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      Phone *
                    </label>

                    <input
                      type="tel"
                      name="phone"
                      placeholder="03XX XXXXXXX"
                      value={formData.phone}
                      onChange={handleChange}
                      pattern="03[0-9]{9}"
                      maxLength="11"
                      required
                    />
                  </div>
                </div>

                {/* EMAIL */}

                <div className="form-group">
                  <label>
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                {/* SERVICE */}

                <div className="form-group">
                  <label>
                    Dental Service *
                  </label>

                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      Select a service
                    </option>

                    <option value="Dental Checkup">
                      Dental Checkup
                    </option>

                    <option value="Teeth Cleaning">
                      Teeth Cleaning
                    </option>

                    <option value="Teeth Whitening">
                      Teeth Whitening
                    </option>

                    <option value="Dental Filling">
                      Dental Filling
                    </option>

                    <option value="Root Canal">
                      Root Canal
                    </option>

                    <option value="Braces">
                      Braces
                    </option>

                    <option value="Other">
                      Other
                    </option>
                  </select>
                </div>

                {/* DATE + TIME */}

                <div className="booking-section">
                  {/* CALENDAR */}

                  <div className="calendar-panel">
                    <div className="booking-label">
                      Preferred Date *
                    </div>

                    <div className="calendar-header">
                      <button
                        type="button"
                        onClick={
                          goToPreviousMonth
                        }
                        disabled={
                          calendarMonth.getFullYear() ===
                            today.getFullYear() &&
                          calendarMonth.getMonth() ===
                            today.getMonth()
                        }
                      >
                        ←
                      </button>

                      <strong>
                        {
                          MONTHS[
                            calendarMonth.getMonth()
                          ]
                        }{" "}
                        {calendarMonth.getFullYear()}
                      </strong>

                      <button
                        type="button"
                        onClick={
                          goToNextMonth
                        }
                      >
                        →
                      </button>
                    </div>

                    <div className="calendar-weekdays">
                      <span>Mon</span>
                      <span>Tue</span>
                      <span>Wed</span>
                      <span>Thu</span>
                      <span>Fri</span>
                      <span className="closed-day">
                        Sat
                      </span>
                      <span className="closed-day">
                        Sun
                      </span>
                    </div>

                    <div className="calendar-grid">
                      {renderCalendarDays()}
                    </div>

                    <div className="calendar-legend">
                      <span>
                        <i className="legend-dot available"></i>
                        Available Days
                      </span>

                      <span>
                        <i className="legend-dot closed"></i>
                        Clinic Closed
                      </span>
                    </div>

                    <div className="clinic-hours">
                      <span>ⓘ</span>

                      <div>
                        <strong>
                          We are open Monday
                          to Friday
                        </strong>

                        <small>
                          9:00 AM – 5:00 PM
                        </small>
                      </div>
                    </div>
                  </div>

                  {/* TIME SLOTS */}

                  <div className="time-panel">
                    <div className="booking-label">
                      Preferred Time *
                    </div>

                    {!formData.appointment_date ? (
                      <div className="select-date-message">
                        <span>📅</span>

                        <strong>
                          Select a date first
                        </strong>

                        <small>
                          Available appointment
                          times will appear here.
                        </small>
                      </div>
                    ) : checkingSlots ? (
                      <div className="select-date-message">
                        <span>⏳</span>

                        <strong>
                          Checking availability...
                        </strong>

                        <small>
                          Please wait a moment.
                        </small>
                      </div>
                    ) : (
                      <div className="time-slots">
                        {TIME_SLOTS.map(
                          ([time, label]) => {
                            const isBooked =
                              bookedSlots.includes(
                                time
                              );

                            const isSelected =
                              formData.appointment_time ===
                              time;

                            return (
                              <button
                                key={time}
                                type="button"
                                className={`time-slot ${
                                  isSelected
                                    ? "selected"
                                    : ""
                                } ${
                                  isBooked
                                    ? "booked"
                                    : ""
                                }`}
                                disabled={
                                  isBooked
                                }
                                onClick={() => {
                                  setFormData(
                                    (
                                      previous
                                    ) => ({
                                      ...previous,
                                      appointment_time:
                                        time,
                                    })
                                  );
                                }}
                              >
                                <span>
                                  {label}
                                </span>

                                <small>
                                  {isBooked
                                    ? "🔒 Booked"
                                    : "✓ Available"}
                                </small>
                              </button>
                            );
                          }
                        )}
                      </div>
                    )}

                    <div className="appointment-duration">
                      <span>🛡</span>

                      <span>
                        Each appointment is for
                        1 hour.
                      </span>
                    </div>
                  </div>
                </div>

                {/* MESSAGE */}

                <div className="form-group">
                  <label>
                    Additional Message
                  </label>

                  <textarea
                    name="message"
                    placeholder="Tell us anything we should know..."
                    value={formData.message}
                    onChange={handleChange}
                    rows="4"
                  />
                </div>

                {errorMessage && (
                  <div className="appointment-error">
                    {errorMessage}
                  </div>
                )}

                {/* FOOTER */}

                <div className="appointment-footer">
                  <div className="security-note">
                    <span>🔒</span>

                    <p>
                      Your information is secure
                      and will only be used to
                      confirm your appointment.
                    </p>
                  </div>

                  <div className="submit-area">
                    <button
                      type="submit"
                      className="submit-appointment"
                      disabled={loading}
                    >
                      {loading
                        ? "Sending..."
                        : "Request Appointment →"}
                    </button>

                    <p className="appointment-note">
                      Your appointment is not
                      confirmed until our clinic
                      contacts you.
                    </p>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}