// Call if url is broken or invalid
const endPoint = (req, res) => {
    res.status(404).send({
        message: 'Endpoint does not exist.'
    });
}

module.exports = { endPoint }