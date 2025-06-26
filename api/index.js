

// Usar module.exports en lugar de export default
module.exports = (req, res) => {
    res.status(200).send('Hello World!');
};