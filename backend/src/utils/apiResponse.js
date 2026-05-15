const success = (res, data, message = "OK", status = 200) =>
  res.status(status).json({ success: true, data, message });

const failure = (res, error, status = 400, details) =>
  res.status(status).json({ success: false, error, ...(details && { details }) });

module.exports = { success, failure };
