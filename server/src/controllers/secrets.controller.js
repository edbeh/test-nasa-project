const httpGetAllSecrets = (req, res) => {
  return res.status(200).json(req.user);
};

module.exports = {
  httpGetAllSecrets,
};
