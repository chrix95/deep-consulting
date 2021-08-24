import { Item, ItemCommon } from "../interfaces";

const Joi = require('@hapi/joi')

const validateItem = (item: Item) => {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        quantity: Joi.number().required(),
        expiry: Joi.number().required()
    });
    return schema.validate(item);
}

const validateItemCommon = (item: ItemCommon) => {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        quantity: Joi.number().required(),
    });
    return schema.validate(item);
}

export default { validateItem, validateItemCommon }