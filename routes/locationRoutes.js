const express = require('express');
const router = express.Router();

// GET /api/location
router.get('/', (req, res) => {
  // Example: Just send a static pharmacy location
  const pharmacyLocation = {
    latitude: 10.762628968541051,  // Replace with your pharmacy's latitude
    longitude: 106.68245952726659, // Replace with your pharmacy's longitude
    name: 'HCMUS Pharmacy',
    address: '227 Nguyen Van Cu, Ward 4, District 5, Ho Chi Minh City'
    };
  res.json(pharmacyLocation);
});

module.exports = router;

10.763005861261071, 106.68248157801663