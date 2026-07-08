const pool = require("../config/db");

// Get all events
const getEvents = async (req, res) => {
  try {
    const events = await pool.query(
      "SELECT * FROM events ORDER BY date DESC"
    );

    res.json({ events: events.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get single event
const getEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await pool.query(
      "SELECT * FROM events WHERE id = $1",
      [id]
    );

    if (event.rows.length === 0) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({ event: event.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create event
const createEvent = async (req, res) => {
  try {
    const {
      name,
      venue,
      gps_location,
      date,
      time,
      capacity,
      description,
      banner_image,
    } = req.body;

    const newEvent = await pool.query(
      `INSERT INTO events 
      (name, venue, gps_location, date, time, capacity, description, banner_image) 
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8) 
      RETURNING *`,
      [
        name,
        venue,
        gps_location,
        date,
        time,
        capacity,
        description,
        banner_image,
      ]
    );

    res.status(201).json({
      message: "Event created successfully",
      event: newEvent.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update event
const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      venue,
      gps_location,
      date,
      time,
      capacity,
      description,
      banner_image,
      is_active,
    } = req.body;

    const updated = await pool.query(
      `UPDATE events 
       SET name=$1, venue=$2, gps_location=$3, date=$4, time=$5,
           capacity=$6, description=$7, banner_image=$8, is_active=$9
       WHERE id=$10
       RETURNING *`,
      [
        name,
        venue,
        gps_location,
        date,
        time,
        capacity,
        description,
        banner_image,
        is_active,
        id,
      ]
    );

    if (updated.rows.length === 0) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({
      message: "Event updated successfully",
      event: updated.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete event (FIXED VERSION - SAFE CASCADE DELETE)
const deleteEvent = async (req, res) => {
  const client = await pool.connect();

  try {
    const { id } = req.params;

    await client.query("BEGIN");

    // 1. Get all ticket types for event
    const ticketTypes = await client.query(
      "SELECT id FROM ticket_types WHERE event_id = $1",
      [id]
    );

    const ticketTypeIds = ticketTypes.rows.map((t) => t.id);

    if (ticketTypeIds.length > 0) {
      // 2. Delete check-ins
      await client.query(
        `DELETE FROM check_ins 
         WHERE ticket_id IN (
           SELECT id FROM tickets WHERE event_id = $1
         )`,
        [id]
      );

      // 3. Delete payments
      await client.query(
        `DELETE FROM payments 
         WHERE ticket_id IN (
           SELECT id FROM tickets WHERE event_id = $1
         )`,
        [id]
      );

      // 4. Delete tickets
      await client.query(
        "DELETE FROM tickets WHERE event_id = $1",
        [id]
      );

      // 5. Delete ticket types
      await client.query(
        "DELETE FROM ticket_types WHERE event_id = $1",
        [id]
      );
    }

    // 6. Delete event
    const result = await client.query(
      "DELETE FROM events WHERE id = $1",
      [id]
    );

    if (result.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Event not found" });
    }

    await client.query("COMMIT");

    res.json({
      message: "Event deleted successfully",
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    res.status(500).json({ message: "Server error" });
  } finally {
    client.release();
  }
};

// Get ticket types for an event
const getTicketTypes = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM ticket_types WHERE event_id = $1",
      [id]
    );

    res.json({ ticketTypes: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const addTicketType = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, quantity, description } = req.body;

    const result = await pool.query(
      `INSERT INTO ticket_types (event_id, name, price, quantity, description)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [id, name, price, quantity, description]
    );

    res.status(201).json({
      message: "Ticket type created",
      ticketType: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



module.exports = {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  getTicketTypes,
  addTicketType,
};