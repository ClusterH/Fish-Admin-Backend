const db = require("../models");
const Terms = db.term;

exports.registerTerms = (req, res) => {
    const newTerms = {
        title: req.body.title,
        content: req.body.content,
        createdDate: new Date(),
    };
    console.log(newTerms)

    Terms.create(newTerms)
        .then(data => {
            return res.status(200).send({result: 'TERMS_REGISTER_SUCCESS', data: data.id});
        })
        .catch(err => {
            return res.status(500).send({msg: err.toString()});
        })
};

exports.getAllTerms = (req, res) => {
    Terms.findAll({
        limit: req.body.limit || 1000000,
        offset: req.body.offset || 0,
    })
        .then(data => {
            return res.status(200).send({result: data});
        }).catch(err => {
        return res.status(500).send({msg: err.toString()});
    })
};

exports.getTermsById = (req, res) => {
    const termsId = req.body.termsId;
    Terms.findOne({
        where: {id: termsId}
    }).then((data) => {
        return res.status(200).send({result: data});
    }).catch(err => {
        return res.status(500).send({msg: err.toString()});
    })
};

exports.updateTerms = async (req, res) => {
    const termsId = req.body.termsId;

    try {
        const terms = await Terms.findOne({
            where: {id: termsId}
        });

        if (!terms) {
            return res.status(404).send({msg: 'TERMS_NOT_FOUND'});
        }

        const keys = Object.keys(req.body);
        for (const key of keys) {
            if (key !== 'termsId') {
                terms[key] = req.body[key];
            }
        }
        await terms.save();

        return res.status(200).send({result: 'TERMS_UPDATE_SUCCESS'});

    } catch (err) {
        return res.status(500).send({msg: err.toString()});
    }
};

exports.deleteTerms = (req, res) => {
    const termsId = req.body.termsId;

    Terms.destroy({
        where: {id: termsId}
    }).then(data => {
        return res.status(200).send({result: 'TERMS_DELETE_SUCCESS'});
    }).catch(err => {
        return res.status(500).send({msg: err.toString()});
    })
};
