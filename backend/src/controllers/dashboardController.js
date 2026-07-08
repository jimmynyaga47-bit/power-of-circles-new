const pool = require("../config/db");

const getDashboardStats = async (req, res) => {
  try {
    const totalEvents = await pool.query(
      "SELECT COUNT(*) FROM events"
    );

    const totalTickets = await pool.query(
      "SELECT COUNT(*) FROM tickets"
    );

   const totalRevenue = await pool.query(`
    SELECT
        COALESCE(SUM(tt.price),0) AS revenue
    FROM tickets t
    JOIN ticket_types tt
        ON t.ticket_type_id = tt.id
    WHERE t.status = 'paid'
`);

    const totalCheckins = await pool.query(
      "SELECT COUNT(*) FROM check_ins"
    );

    const totalAdmins = await pool.query(
      "SELECT COUNT(*) FROM users WHERE role_id = 1"
    );

    const pendingAdmins = await pool.query(
      "SELECT COUNT(*) FROM users WHERE approved = FALSE"
    );
    const upcomingEvents = await pool.query(`
SELECT
id,
name,
date,
venue
FROM events
WHERE date >= CURRENT_DATE
ORDER BY date
LIMIT 5
`);

    const recentTickets = await pool.query(`
SELECT
    t.ticket_number,
    t.customer_name,
    e.name AS event_name,
    tt.name AS ticket_type,
    tt.price,
    t.status,
    t.created_at
FROM tickets t
JOIN events e
    ON t.event_id=e.id
JOIN ticket_types tt
    ON t.ticket_type_id=tt.id
ORDER BY t.created_at DESC
LIMIT 5
`);

    // Ticket Categories breakdown (Paid, Complimentary, VIP Invitation, Staff, Media, Speaker)
    const ticketCategories = await pool.query(`
SELECT
    COALESCE(category, 'paid') AS category,
    COUNT(*) AS count
FROM tickets
GROUP BY COALESCE(category, 'paid')
ORDER BY count DESC
`);

    // Ticket sales over the last 6 months, for the sales trend graph
    const salesTrend = await pool.query(`
SELECT
    TO_CHAR(DATE_TRUNC('month', t.created_at), 'Mon YYYY') AS month,
    COUNT(*) AS tickets_sold,
    COALESCE(SUM(tt.price) FILTER (WHERE t.status = 'paid'), 0) AS revenue
FROM tickets t
JOIN ticket_types tt ON t.ticket_type_id = tt.id
WHERE t.created_at >= NOW() - INTERVAL '6 months'
GROUP BY DATE_TRUNC('month', t.created_at)
ORDER BY DATE_TRUNC('month', t.created_at)
`);

    res.json({
      totalEvents: Number(totalEvents.rows[0].count),
      totalTickets: Number(totalTickets.rows[0].count),
      totalRevenue: Number(totalRevenue.rows[0].revenue),
      totalCheckins: Number(totalCheckins.rows[0].count),
      totalAdmins: Number(totalAdmins.rows[0].count),
      pendingAdmins: Number(pendingAdmins.rows[0].count),
      upcomingEvents: upcomingEvents.rows,
      recentTickets: recentTickets.rows,
      ticketCategories: ticketCategories.rows.map((r) => ({
        category: r.category,
        count: Number(r.count),
      })),
      salesTrend: salesTrend.rows.map((r) => ({
        month: r.month,
        ticketsSold: Number(r.tickets_sold),
        revenue: Number(r.revenue),
      })),
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server Error"
    });
  }
};

module.exports = {
  getDashboardStats
};