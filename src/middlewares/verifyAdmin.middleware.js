export const isAdmin = (req, res, next) => {
    try {
        if(req.user.role !== 'admin') {
            return res.status(401).json({
                message: 'Access Denied! Admins only'
            })
        }
        next();
    } catch (error) {
        return res.status(500).json({
            message: 'Server Error while verifying admin'
        })
    }
}