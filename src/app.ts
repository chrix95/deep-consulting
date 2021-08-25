import express, { Request, Response } from 'express';
import { setInterval } from 'timers';
import productRoutes from './routes/product'
import { removeExpiredItems } from './functions/index'

const router = express();

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.use("/", productRoutes);
router.get("*", (req: Request, res: Response) => res.redirect("/"));

// Clear expired items from the database every 5 minute
setInterval(() => {
    removeExpiredItems()
}, 300000) // 1 minute = 60000, 5 minutes = (60000 * 5) = 300000

const PORT: string = process.env.PORT || "3000"

router.listen(PORT, () => console.log(`Server starting on port: ${PORT}`));