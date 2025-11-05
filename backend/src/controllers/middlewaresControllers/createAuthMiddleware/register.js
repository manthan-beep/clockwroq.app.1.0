const Joi = require('joi');
const mongoose = require('mongoose');
const { generate: uniqueId } = require('shortid');

const register = async (req, res, { userModel }) => {
  const UserPasswordModel = mongoose.model(userModel + 'Password');
  const UserModel = mongoose.model(userModel);
  const { name, surname, email, password } = req.body;

  // validate
  const objectSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string()
      .email({ tlds: { allow: true } })
      .required(),
    password: Joi.string().min(6).required(),
    surname: Joi.string().allow('', null).optional(),
  });

  const { error, value } = objectSchema.validate({ name, surname, email, password });
  if (error) {
    return res.status(409).json({
      success: false,
      result: null,
      error: error,
      message: 'Invalid/Missing credentials.',
      errorMessage: error.message,
    });
  }

  // Check if user already exists
  const existingUser = await UserModel.findOne({ email: email, removed: false });

  if (existingUser) {
    return res.status(409).json({
      success: false,
      result: null,
      message: 'An account with this email already exists.',
    });
  }

  // Create new user
  const newUser = {
    email: email.toLowerCase().trim(),
    name: name,
    surname: surname || '',
    enabled: true,
    role: 'owner',
  };

  const user = await new UserModel(newUser).save();

  // Create password entry
  const newUserPassword = new UserPasswordModel();
  const salt = uniqueId();
  const passwordHash = newUserPassword.generateHash(salt, password);

  const passwordData = {
    password: passwordHash,
    emailVerified: false, // Set to false, can be verified via email later
    salt: salt,
    user: user._id,
  };

  await new UserPasswordModel(passwordData).save();

  return res.status(200).json({
    success: true,
    result: {
      _id: user._id,
      name: user.name,
      surname: user.surname,
      email: user.email,
      role: user.role,
    },
    message: 'Account created successfully. Please login to continue.',
  });
};

module.exports = register;

