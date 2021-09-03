const checkIfAuthorized = (opts) =>{
    return (req, res, next) => {
        if (opts.hasRole.includes(req.user.user_role)) {
            next();
        } else {
            res.status(401).send('No tiene los permisos indicados para realizar esta operación');
        }
    }
}
export default checkIfAuthorized;
  