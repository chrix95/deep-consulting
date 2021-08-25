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

export const removeExpiredItems = async () => {
    try {
        let query = `SELECT id FROM items WHERE expiry < "${new Date().getTime()}"`;
        const response = await QueryDB(query);
        const results: any = response.results
        if (results.length > 0) {
            results.forEach((element: any) => {
                deleteItemInDB(element.id)
            });
            console.log("Expired items has been cleared")
        } else {
            console.log("No Expired items 😘")
        }
    } catch (error: any) {
        console.log("Error updating stock")
        console.log(error.message)
    }
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

const deleteItemInDB = (id: number) => {
    try {
        let query = `DELETE FROM items WHERE id = ?`;
        QueryDB(query, [`${id}`]);
    } catch (error: any) {
        console.log("Error deleting item")
        console.log(error.message)
    }
}