// Runs once before the test workers start, so they inherit this time zone.
// Date logic is tested in Europe/Paris (the app's main audience, with DST changes)
// instead of whatever the machine or CI runner uses (UTC has no DST and hides bugs).
module.exports = () => {
  process.env.TZ = "Europe/Paris";
};
