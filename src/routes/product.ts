import express from "express";
import controller from '../controllers/product';

const router = express.Router();

router.post('/:item/add', controller.createItem);
router.get('/:item/quantity', controller.getItemQuantity);
router.post('/:item/sell', controller.sellItemQuantity);

export = router;