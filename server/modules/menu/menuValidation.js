const httpStatus = require('http-status');
const isEmpty = require('../../validation/isEmpty');
const menuConfig = require('./menuConfig');
const otherHelper = require('../../helper/others.helper');
const { menuSch } = require('./menuschema')
const validation = {};

validation.sanitize = (req, res, next) => {
  const sanitizeArray = [
    {
      field: 'title',
      sanitize: {
        trim: true,
      },
    }, {
      field: 'order',
      sanitize: {
        trim: true,
      },
    }, {
      field: 'key',
      sanitize: {
        trim: true,
      },
    },
  ];
  otherHelper.sanitize(req, sanitizeArray);
  next();
};

validation.validate = async (req, res, next) => {
  const data = req.body;
  const validateArray = [
    {
      field: 'title',
      validate: [
        {
          condition: 'IsEmpty',
          msg: menuConfig.validate.empty,
        },
        {
          condition: 'IsLength',
          msg: menuConfig.validate.titleLength,
          option: {
            min: 3,
            max: 100,
          },
        },
      ],
    },
    {
      field: 'key',
      validate: [
        {
          condition: 'IsEmpty',
          msg: menuConfig.validate.empty,
        },
      ],
    },
    {
      field: 'order',
      validate: [
        {
          condition: 'IsEmpty',
          msg: menuConfig.validate.empty,
        }, {
          condition: 'IsInt',
          msg: menuConfig.validate.isInt,
        },
      ],
    },
  ];
  let errors = otherHelper.validation(data, validateArray);

  let key_filter = { is_deleted: false, key: data.key }
  if (data._id) {
    key_filter = { ...key_filter, _id: { $ne: data._id } }
  }
  const already_key = await menuSch.findOne(key_filter);
  if (already_key && already_key._id) {
    errors = { ...errors, key: 'key already exist' }
  }

  if (!isEmpty(errors)) {
    return otherHelper.sendResponse(res, httpStatus.BAD_REQUEST, false, null, errors, menuConfig.errorIn.invalidInputs, null);
  } else {
    next();
  }
};

validation.itemSanitize = (req, res, next) => {
  const sanitizeArray = [
    {
      field: 'title',
      sanitize: {
        trim: true,
      },
    },
    {
      field: 'link',
      sanitize: {
        trim: true,
      },
    },
  ];
  otherHelper.sanitize(req, sanitizeArray);
  next();
};

validation.itemValidate = (req, res, next) => {
  const data = req.body;
  const validateArray = [
    {
      field: 'title',
      validate: [
        {
          condition: 'IsEmpty',
          msg: menuConfig.validate.empty,
        },
        {
          condition: 'IsLength',
          msg: menuConfig.validate.titleLength,
          option: {
            min: 3,
            max: 100,
          },
        },
      ],
    },
    {
      field: 'url',
      validate: [
        {
          condition: 'IsEmpty',
          msg: menuConfig.validate.empty,
        },
        {
          condition: 'IsLength',
          msg: menuConfig.validate.descriptionLength,
          option: {
            min: 5,
            max: 2000,
          },
        },
      ],
    },
    {
      field: 'menu_sch_id',
      validate: [
        {
          condition: 'IsEmpty',
          msg: menuConfig.validate.empty,
        },
        {
          condition: 'IsMongoId',
          msg: menuConfig.validate.invalid,
        },
      ],
    },
    {
      field: 'order',
      validate: [
        {
          condition: 'IsEmpty',
          msg: menuConfig.validate.empty,
        },
        {
          condition: 'IsInt',
          msg: menuConfig.validate.invalid,
        },
      ],
    },
    {
      field: 'is_internal',
      validate: [
        {
          condition: 'IsEmpty',
          msg: menuConfig.validate.empty,
        },
        {
          condition: 'IsBoolean',
          msg: menuConfig.validate.invalid,
        },
      ],
    },
    {
      field: 'target',
      validate: [
        {
          condition: 'IsEmpty',
          msg: menuConfig.validate.empty,
        },
      ],
    },
  ];
  const errors = otherHelper.validation(data, validateArray);

  if (!isEmpty(errors)) {
    return otherHelper.sendResponse(res, httpStatus.BAD_REQUEST, false, null, errors, menuConfig.errorIn.invalidInputs, null);
  } else {
    next();
  }
};
module.exports = validation;
