// Controller
const tripsEndpoint = 'http://localhost:3000/api/trips';

const travel = async (req, res) => {
  try {
    const response = await fetch(tripsEndpoint, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) {
      return res.status(response.status).render('error', { message: 'Failed to load trips from API.' });
    }

    const trips = await response.json();

    return res.render('travel', {
      title: 'Travel',
      trips,
      layout: 'layouts/layout'
    });
  } catch (err) {
    console.error('Error fetching trips:', err);
    return res.status(500).render('error', { message: 'Failed to load trips from API.' });
  }
};

module.exports = { travel };
