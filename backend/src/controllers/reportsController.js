const pool = require("../config/db");

// Revenue & ticket sales grouped by event
const getEventReport = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        e.id,
        e.name,
        e.date,
        e.venue,
        COUNT(t.id) AS tickets_sold,
        COALESCE(SUM(tt.price) FILTER (WHERE t.status = 'paid'), 0) AS revenue,
        COUNT(t.id) FILTER (WHERE t.status = 'checked_in') AS checked_in,
        COUNT(t.id) FILTER (WHERE t.status = 'cancelled') AS cancelled
      FROM events e
      LEFT JOIN tickets t ON t.event_id = e.id
      LEFT JOIN ticket_types tt ON t.ticket_type_id = tt.id
      GROUP BY e.id
      ORDER BY e.date DESC
    `);

    res.json({
      events: result.rows.map((r) => ({
        ...r,
        tickets_sold: Number(r.tickets_sold),
        revenue: Number(r.revenue),
        checked_in: Number(r.checked_in),
        cancelled: Number(r.cancelled),
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Revenue & sales grouped by ticket category
const getCategoryReport = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        COALESCE(t.category, 'paid') AS category,
        COUNT(t.id) AS count,
        COALESCE(SUM(tt.price) FILTER (WHERE t.status = 'paid'), 0) AS revenue
      FROM tickets t
      JOIN ticket_types tt ON t.ticket_type_id = tt.id
      GROUP BY COALESCE(t.category, 'paid')
      ORDER BY count DESC
    `);

    res.json({
      categories: result.rows.map((r) => ({
        category: r.category,
        count: Number(r.count),
        revenue: Number(r.revenue),
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Check-in / attendance report
const getCheckinReport = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        e.id,
        e.name,
        COUNT(t.id) AS total_tickets,
        COUNT(t.id) FILTER (WHERE t.status = 'checked_in') AS checked_in
      FROM events e
      LEFT JOIN tickets t ON t.event_id = e.id
      GROUP BY e.id
      ORDER BY e.date DESC
    `);

    res.json({
      events: result.rows.map((r) => ({
        id: r.id,
        name: r.name,
        total_tickets: Number(r.total_tickets),
        checked_in: Number(r.checked_in),
        attendance_rate:
          Number(r.total_tickets) > 0
            ? Math.round((Number(r.checked_in) / Number(r.total_tickets)) * 100)
            : 0,
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getEventReport,
  getCategoryReport,
  getCheckinReport,
};
