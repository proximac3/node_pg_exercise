const express = require("express");
const app = require("../app");
const router = new express.Router();
const ExpressError = require("../expressError")
const db = require('../db')

router.get('/', async (req, res) => {
    // get list of companie from DB
    const results = await db.query('SELECT * FROM companies;')

    return res.json({ companies: results.rows })
});

router.get('/:code', async (req, res, next) => {
    // get a single company
    try {
        const { code } = req.params
        const result = await db.query(`SELECT * FROM companies WHERE code=$1`, [code])

        // error handling for empty results
        if (result.rows.length === 0) {
            throw new ExpressError('Cannot find company with that code', 404)
        } else {
            return res.json({ companies: result.rows })
        }
    } catch (e) {
        return next(e)
    }

});

router.post('/', async (req, res, next) => {
    // Add Company
    try {
        const { code, name, description } = req.body
        const results = await db.query('INSERT INTO companies(code, name, description) VALUES($1, $2, $3) RETURNING code, name, description', [code, name, description])

        if (code.length < 1 || name.length < 1 || description.length < 1) {
            throw new ExpressError('code, name, and description must be specified', 404)
        } else {
            return res.status(201).json({ company: results.rows[0] })
        }
    } catch (e) {
        return next(e)
    }
});

router.put('/:code', async (req, res, next) => {
    // Edit existing company
    try {
        const code_name = req.params.code
        const { code, name, description } = req.body
        const response = await db.query('UPDATE companies SET code=$1, name=$2, description=$3 WHERE code=$4 RETURNING code, name, description', [code, name, description, code_name])

        if (response.rows.length === 0) {
            throw new ExpressError(`provide valid company code. ${code_name} does not exist`, 404)
        } else {
            return res.status(201).json({ company: response.rows[0] })
        }
    } catch (e) {
        return next(e)
    }
});

router.delete('/:code', async (req, res, next) => {
    // delete single company
    try {
        const { code } = req.params
        const checkCode = await db.query("SELECT * FROM companies WHERE code=$1", [code])

        if (checkCode.rows.length > 0) {
            const result = await db.query('DELETE from companies WHERE code=$1', [code])
            return res.json({ message: "DELETED" })
        } else {
            throw new ExpressError('Invalied company code', 400)
        }

    } catch (e) {
        return next(e)
    }
})









// export router
module.exports = router;

