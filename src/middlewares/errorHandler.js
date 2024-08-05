
const errorHandler = (err, req, res, next) => {
    console.error(err.stack, err.message);
    res.status(500).send('Something broke!');
};
export default errorHandler;