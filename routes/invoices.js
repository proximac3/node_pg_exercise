const express = require("express");
const invoiceRouter = new express.Router();
const ExpressError = require("../expressError")
const db = require('../db');


invoiceRouter.get('/', async (req, res, next) => {
    // get a invoices
    const response = await db.query('SELECT * FROM invoices')
    return res.send({invoices: response.rows})
})


invoiceRouter.get('/:comp_code', async (req, res, next) => {
    // get single invoice
    try {
        const { comp_code } = req.params
        const response = await db.query('SELECT * FROM invoices WHERE comp_code=$1', [comp_code])

        // error handling
        if (response.rows.length === 0) {
            return res.json({ message: 'cannot find company' })
        } else {
            return res.json({ invoice: response.rows[0] })
        }
    } catch (e) {
        return next(e)
    }
});


invoiceRouter.put('/:comp_code', async (req, res, next) => {
    // update existing invoice
    try {
        const { comp_code } = req.params
        const { amt, paid } = req.body

        const response = await db.query("UPDATE invoices SET amt=$1, paid=$2 WHERE comp_code=$3 RETURNING comp_code, amt, paid", [amt, paid, comp_code])

        if (response.rows.length === 0) {
            return res.json({message: "cannot find inivoice"})
        } else {
            return res.json({message: response.rows[0]})
        }
    } catch (e) {
        return next(e)
    }
});


invoiceRouter.delete('/:id', async (req, res, next) => {
    try {
        const { id} = req.params
        // error handling 
        const checkInvoice = await db.query("SELECT * FROM invoices WHERE id=$1", [id])

        if (checkInvoice.rows.length === 0) {
            return res.status(404).json({message: "cannot find company"})
        } else {
            const response = await db.query("DELETE from invoices WHERE id=$1", [id])
            return res.json({message: "DELETED"})
        }

    } catch (e) {
        return next(e)
    }
})



// export router
module.exports = invoiceRouter