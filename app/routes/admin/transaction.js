const express = require("express");
const router = express.Router();
const models = require("../../models");
const values = require("../../values");
const middleware = require('../../middleware');


router.get("/",middleware.adminAuthentication, async (req,res)=>{
    try{
        const transactions = await models.Transaction.find().populate("user products.product");
        res.status(200).json(transactions)
    }catch (e) {
        res.status(500).json({Error: values.statusCodes.ER_SMT_WRONG})
    }
});

router.get("/:page", middleware.adminAuthentication, async (req, res) => {
    try {
            const transactions = await models.Transaction.paginate(
                {},
                {
                    page: req.params.page,
                    limit: 10,
                    populate: {path: "user products.product"}
                }
            );
            res.status(200).json(transactions);
    } catch (e) {
        res.status(500).json({Error: values.statusCodes.ER_SMT_WRONG});
    }
});

module.exports = router;