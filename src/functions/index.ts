import { QueryDB } from "../config/mysql";

export const reduceSales = (results: any[], quantity: number) => {
    let remaining = quantity;
    for (let singleItem of results ) {
        const itemRemains = singleItem.quantity - remaining;
        let canBreak = false;
        if (itemRemains < 0) {
            updateDB({
                id: singleItem.id,
                quantity: 0
            });
            remaining = Math.abs(itemRemains);
        } else if (itemRemains == 0) {
            updateDB({
                id: singleItem.id,
                quantity: singleItem.quantity - remaining
            });
            canBreak = true;
        } else {
            updateDB({
                id: singleItem.id,
                quantity: singleItem.quantity - remaining
            });
            canBreak = true;
        }

        if (canBreak) {
            break;
        }
    }
    return true;
}

const updateDB = (item: { id: number, quantity: number }) => {
    try {
        let query = `UPDATE items SET quantity = ? WHERE id = ?`;
        QueryDB(query, [`${item.quantity}`, `${item.id}`]);
    } catch (error: any) {
        console.log("Error updating stock")
        console.log(error.message)
    }
}