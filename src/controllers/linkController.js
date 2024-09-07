
const Link = require("../models/linkModel");

const createLink = async (req, res) => {
  try {
    const { originalUrl, customCode } = req.body;
  
  let shortCode = customCode || nanoid(6);
  
  if (customCode) {
    const existing = await Url.findOne({ shortCode: customCode });
    if (existing) return res.status(400).json({ error: 'Custom code already exists' });
  }
  
  let url = await Url.findOne({ originalUrl });
  if (!url) {
    url = new Url({ originalUrl, shortCode });
    await url.save();
  }
  
  res.json({ originalUrl: url.originalUrl, shortCode: url.shortCode });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

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
  }
}


module.exports = { createLink };
