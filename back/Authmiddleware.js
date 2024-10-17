import jwt from 'jsonwebtoken';
export const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(403).json({ message: "Пользователь не авторизован" });
        }

        const decodedData = jwt.verify(token, 'secret123');
        req.user = decodedData;
        next();
    } catch (err) {
        console.log(err);
        return res.status(403).json({ message: "Пользователь не авторизован" });
    }
};