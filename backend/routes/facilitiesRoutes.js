const express = require('express');
const router = express.Router();

// Sample facilities data
const facilities = [
  // Orphanages
  {
    id: 1,
    name: "New Life Children's Home",
    type: "orphanage",
    description: "Providing love and care since 1995",
    location: { city: "Chennai", state: "Tamil Nadu" },
    capacity: { total: 100, current: 75 },
    needs: ["food", "clothes", "books", "health"],
    contactInfo: { phone: "044-26157234", email: "contact@newlife.org" },
    donations: [] // Add this field
  },
  {
    id: 2,
    name: "Grace Children's Home",
    type: "orphanage",
    description: "Nurturing young lives since 2000",
    location: { city: "Mumbai", state: "Maharashtra" },
    capacity: { total: 150, current: 120 },
    needs: ["clothes", "books", "health"],
    contactInfo: { phone: "022-28901234", email: "info@gracehome.org" }
  },
  {
    id: 3,
    name: "Hope & Joy Center",
    type: "orphanage",
    description: "Creating smiles and bright futures",
    location: { city: "Pune", state: "Maharashtra" },
    capacity: { total: 85, current: 65 },
    needs: ["food", "clothes", "health"],
    contactInfo: { phone: "020-25678901", email: "care@hopejoy.org" }
  },
  {
    id: 7,
    name: "Sunshine Orphanage",
    type: "orphanage",
    description: "A home for every child",
    location: { city: "Kolkata", state: "West Bengal" },
    capacity: { total: 90, current: 70 },
    needs: ["food", "books"],
    contactInfo: { phone: "033-24567890", email: "info@sunshine.org" }
  },
  {
    id: 8,
    name: "Little Stars Home",
    type: "orphanage",
    description: "Empowering children for a better tomorrow",
    location: { city: "Lucknow", state: "Uttar Pradesh" },
    capacity: { total: 60, current: 50 },
    needs: ["clothes", "health"],
    contactInfo: { phone: "0522-2233445", email: "contact@littlestars.org" }
  },
  {
    id: 9,
    name: "Rainbow Shelter",
    type: "orphanage",
    description: "Coloring lives with hope",
    location: { city: "Ahmedabad", state: "Gujarat" },
    capacity: { total: 80, current: 60 },
    needs: ["food", "clothes", "books"],
    contactInfo: { phone: "079-33445566", email: "hello@rainbowshelter.org" }
  },

  // Old Age Homes
  {
    id: 4,
    name: "Peaceful Sunset Home",
    type: "oldAgeHome",
    description: "Dignified care for senior citizens",
    location: { city: "Hyderabad", state: "Telangana" },
    capacity: { total: 60, current: 45 },
    needs: ["health", "food", "clothes"],
    contactInfo: { phone: "040-23789456", email: "care@peacefulsunset.org" }
  },
  {
    id: 5,
    name: "Golden Years Haven",
    type: "oldAgeHome",
    description: "Comfortable living for seniors",
    location: { city: "Bangalore", state: "Karnataka" },
    capacity: { total: 50, current: 40 },
    needs: ["health", "food"],
    contactInfo: { phone: "080-41234567", email: "info@goldenyears.org" }
  },
  {
    id: 6,
    name: "Silver Care Center",
    type: "oldAgeHome",
    description: "Professional care with compassion",
    location: { city: "Delhi", state: "Delhi" },
    capacity: { total: 75, current: 60 },
    needs: ["food", "health", "clothes"],
    contactInfo: { phone: "011-45678901", email: "contact@silvercare.org" }
  },
  {
    id: 10,
    name: "Elder's Nest",
    type: "oldAgeHome",
    description: "A peaceful nest for elders",
    location: { city: "Jaipur", state: "Rajasthan" },
    capacity: { total: 55, current: 38 },
    needs: ["clothes", "health"],
    contactInfo: { phone: "0141-2233445", email: "elders@nest.org" }
  },
  {
    id: 11,
    name: "Serene Life Home",
    type: "oldAgeHome",
    description: "Serenity and care for the aged",
    location: { city: "Patna", state: "Bihar" },
    capacity: { total: 40, current: 30 },
    needs: ["food", "books"],
    contactInfo: { phone: "0612-3344556", email: "info@serenelife.org" }
  },
  {
    id: 12,
    name: "Harmony Senior Living",
    type: "oldAgeHome",
    description: "Harmony and happiness for seniors",
    location: { city: "Thiruvananthapuram", state: "Kerala" },
    capacity: { total: 65, current: 50 },
    needs: ["health", "clothes"],
    contactInfo: { phone: "0471-4455667", email: "contact@harmonysenior.org" }
  }
];

// Get all facilities
router.get('/', (req, res) => {
  res.json(facilities);
});

// Get facility by ID
router.get('/:id', (req, res) => {
  const facility = facilities.find(f => f.id === parseInt(req.params.id));
  if (!facility) {
    return res.status(404).json({ message: 'Facility not found' });
  }
  res.json(facility);
});

router.post('/:id/donate', (req, res) => {
  const facility = facilities.find(f => f.id === parseInt(req.params.id));
  if (!facility) {
    return res.status(404).json({ message: 'Facility not found' });
  }
  const donation = {
    donorName: req.body.donorName,
    donationType: req.body.donationType,
    details: req.body.details,
    status: 'pending' // for collection
  };
  facility.donations = facility.donations || [];
  facility.donations.push(donation);
  res.json({ message: 'Donation recorded', donation });
});

module.exports = router;