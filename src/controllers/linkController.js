const Url = require("../models/linkModel"); // Ensure this model is correct
const Visit = require("../models/visitModel"); // Assuming you have a Visit model
const useragent = require('useragent'); // Import useragent

// Dynamically import nanoid
async function generateShortCode() {
  const { nanoid } = await import('nanoid');
  return nanoid(6);
}

// Create shortened link
const createLink = async (req, res) => {
  try {
    const { originalUrl, customCode, expiresIn } = req.body;

    // Use the function when generating a short code
    let shortCode = customCode || await generateShortCode();

    if (customCode) {
      const existing = await Url.findOne({ shortCode: customCode });
      if (existing) return res.status(400).json({ error: 'Custom code already exists' });
    }

    let expirationDate = expiresIn ? new Date(Date.now() + expiresIn * 1000) : null; // e.g., 3600 for 1 hour

    let url = await Url.findOne({ originalUrl });
    if (!url) {
      url = new Url({ originalUrl, shortCode, expiresAt: expirationDate });
      await url.save();
    }

    res.json({ originalUrl: url.originalUrl, shortCode: url.shortCode, expiresAt: url.expiresAt });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

// Handle URL redirection and tracking
const getURl = async (req, res) => {
  try {
    const { shortCode } = req.params;
    const url = await Url.findOne({ shortCode });

    if (!url) {
      return res.status(404).json({ error: 'URL not found' });
    }

    // Parse user agent for device type
    const agent = useragent.parse(req.headers['user-agent']);
    let deviceType = 'desktop';
    if (agent.isMobile) deviceType = 'mobile';
    else if (agent.isTablet) deviceType = 'tablet';

    const ipAddress = req.ip;
    const referrer = req.get('Referrer') || 'Direct';

    const visit = new Visit({
      shortCode,
      ipAddress,
      userAgent: req.headers['user-agent'],
      deviceType,
      referrer,
    });

    await visit.save();

    // Update URL stats
    url.visitCount += 1;
    url.visitsByDevice[deviceType] += 1;

    const existingVisit = await Visit.findOne({ shortCode, ipAddress });
    if (!existingVisit) url.uniqueVisitorCount += 1;

    if (url.referrers.has(referrer)) {
      url.referrers.set(referrer, url.referrers.get(referrer) + 1);
    } else {
      url.referrers.set(referrer, 1);
    }

    url.visitLogs.push(visit);
    await url.save();

    res.redirect(302, url.originalUrl);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

// Get analytics for a specific short code
const getAnalytics = async (req, res) => {
  try {
    const { shortCode } = req.params;
    const url = await Url.findOne({ shortCode }).populate('visitLogs');

    if (!url) {
      return res.status(404).json({ error: 'URL not found' });
    }

    res.json({
      originalUrl: url.originalUrl,
      totalVisits: url.visitCount,
      uniqueVisitors: url.uniqueVisitorCount,
      visitsByDevice: url.visitsByDevice,
      referrers: Object.fromEntries(url.referrers),
      visitLogs: url.visitLogs.map(visit => ({
        timestamp: visit.timestamp,
        ipAddress: visit.ipAddress,
        deviceType: visit.deviceType,
        referrer: visit.referrer,
      }))
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { createLink, getURl, getAnalytics };
