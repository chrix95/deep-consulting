import { NextFunction, Response, Request, response } from "express";
import { QueryDB } from "../config/mysql";
import validator from '../functions/validations'
import { reduceSales } from '../functions/index'
import { Item, ItemCommon } from '../interfaces/index'

const createItem = async (req: Request, res: Response, next: NextFunction) => {
    let item: Item = {
        name: req.params.item,
        quantity: req.body.quantity,
        expiry: req.body.expiry
    };

    const { error } = validator.validateItem(item);
    if (error) return res.status(400).send({
        message: error.details[0].message,
        status: false
    });

    try {
        let query = `INSERT INTO items (name, quantity, expiry) VALUES (?, ?, ?)`;
        let values = [`${item.name}`, `${item.quantity}`, `${item.expiry}`];
        const response = await QueryDB(query, values);
        if (response.status) {
            return res.status(200).json({});
        }
        return res.status(500).json({
            message: response.message
        });
    } catch (error: any) {
        return res.status(500).json({
            message: error.message
        });
    }

};

const getItemQuantity = async (req: Request, res: Response, next: NextFunction) => {

    let name: string = req.params.item

    if (!name) {
        return res.status(400).json({
            message: 'Item name is required',
            status: false
        });
    }

    
    try {
        let query = `SELECT quantity, expiry FROM items WHERE name = ? AND quantity > 0 AND expiry > "${new Date().getTime()}" ORDER BY expiry`;
        const response = await QueryDB(query, [`${name}`]);
        if (response.status) {
            const results: any = response.results
            // check if the requested item exist
            if (results.length === 0) {
                return res.status(200).json({
                    quantity: 0,
                    validTill: null
                })
            }
            // Add all the quantity on the item
            let totalQuantity = results.reduce((accItem: number, item: { quantity: number, expiry: number }) => accItem += item.quantity, 0)
            return res.status(200).json({
                quantity: totalQuantity,
                validTill: results[0].expiry
            })
        }
        return res.status(500).json({
            message: response.message
        });
    } catch (error: any) {
        return res.status(500).json({
            message: error.message
        });
    }
};

const sellItemQuantity = async (req: Request, res: Response, next: NextFunction) => {
    
    let item: ItemCommon = {
        name: req.params.item,
        quantity: req.body.quantity
    };

    const { error } = validator.validateItemCommon(item);
    if (error) return res.status(400).send({
        message: error.details[0].message,
        status: false
    });

    try {
        let query = `SELECT * FROM items WHERE name = ? AND quantity > 0 AND expiry > "${new Date().getTime()}" ORDER BY expiry`;
        
        const response = await QueryDB(query, [`${item.name}`]);
        if (response.status) {
            const results: any = response.results
            const totalQuantity = results.reduce((accItem: number, item: { quantity: number, expiry: number }) => accItem += item.quantity, 0)
            if (results.length > 0) {
                // check if the available stock is enough for the sell request
                if (item.quantity > totalQuantity) {
                    return res.status(409).json({
                        message: `${item.name} sell cannot exceed ${item.quantity}`
                    })
                }
                res.status(200).json({})
                // reduce the item in the database based on the required quantity
                reduceSales(results, item.quantity)
            } else {
                return res.status(200).json({
                    quantity: 0,
                    validTill: null
                })
            }
        } else {
            return res.status(500).json({
                message: response.message
            });
        }
    } catch (error: any) {
        return res.status(500).json({
            message: error.message
        });
    }
}

export default { createItem, getItemQuantity, sellItemQuantity }