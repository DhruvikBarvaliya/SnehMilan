const UserModel = require("../Models/UserModel");
const bcrypt = require("bcryptjs");

module.exports = {
  addUser: async (req, res) => {
    try {
      const { first_name, middle_name, last_name, marks, total_marks, std } =
        req.body;
      if (!first_name) {
        return res
          .status(400)
          .json({ status: false, message: "first_name is Required" });
      }
      if (!last_name) {
        return res
          .status(400)
          .json({ status: false, message: "last_name is Required" });
      }
      if (!std) {
        return res
          .status(400)
          .json({ status: false, message: "std is Required" });
      }
      if (!marks) {
        return res
          .status(400)
          .json({ status: false, message: "marks is Required" });
      }
      if (!total_marks) {
        return res
          .status(400)
          .json({ status: false, message: "total_marks is Required" });
      }

      const percentage = (marks / total_marks) * 100;

      let full_name;

      if (middle_name) {
        full_name = `${first_name} ${middle_name} ${last_name}`;
      } else {
        full_name = `${first_name} ${last_name}`;
      }
      const user = await UserModel.findOne({ full_name: full_name });

      if (user) {
        return res
          .status(400)
          .json({ status: true, message: "User already registered" });
      } else {
        const userData = new UserModel({
          role: "STUDENT",
          first_name,
          middle_name,
          last_name,
          full_name: full_name,
          marks,
          total_marks,
          std,
          percentage,
        });
        userRole = userData.role;
        userData
          .save()
          .then((data) => {
            return res
              .status(201)
              .json({ message: "User registered Successfully" });
          })
          .catch((error) => {
            return res.status(400).json({
              status: false,
              message: error.errors.std.message,
              path: error.errors.std.properties.path,
            });
          });
      }
    } catch (err) {
      return res.status(500).json({
        status: false,
        message: "Server Error",
        error: err.message || err.toString(),
      });
    }
  },
  getAllUser: async (req, res) => {
    try {
      let allUser = await UserModel.find().sort({ percentage: -1 });
      console.log(allUser);
      allUser = allUser.filter((user) => user.role != "SUPER_ADMIN");

      if (allUser.length == 0) {
        return res
          .status(404)
          .json({ status: false, message: `User Not Found In Database` });
      }

      function groupBy(arr, key) {
        return arr.reduce((acc, obj) => {
          const property = obj[key];
          acc[property] = acc[property] || [];
          acc[property].push(obj);
          return acc;
        }, {});
      }

      const userData = groupBy(allUser, "std");

      return res.status(200).json({
        status: true,
        message: "Student Get Successfully",
        userData,
      });
    } catch (err) {
      return res.status(500).json({
        status: false,
        message: "Server Error",
        error: err.message || err.toString(),
      });
    }
  },
  getUserById: async (req, res) => {
    try {
      const { user_id } = req.params;
      const employee = await UserModel.findById({ _id: user_id });
      if (employee == null) {
        return res.status(404).json({
          status: false,
          message: `User Not Found With ID :- ${user_id} `,
        });
      }
      return res
        .status(200)
        .json({ status: true, message: "User Get Successfully", employee });
    } catch (err) {
      return res.status(500).json({
        status: false,
        message: "Server Error",
        error: err.message || err.toString(),
      });
    }
  },
  updateUser: async (req, res) => {
    try {
      const { user_id } = req.params;
      const { first_name, middle_name, last_name, marks, total_marks, std } =
        req.body;
      const employee_role = await UserModel.findById(
        { _id: user_id },
        { role: 1 }
      );
      if (employee_role == "EMPLOYEE") {
        delete req.body.role;
        delete req.body.password;
        delete req.body.is_active;
        delete req.body.is_verified;
      }

      if (first_name && middle_name && last_name) {
        var full_name = `${first_name} ${middle_name} ${last_name}`;
        req.body.full_name = full_name;
      } else if (first_name && middle_name) {
        var full_name = `${first_name} ${middle_name}`;
        req.body.full_name = full_name;
      } else if (middle_name && last_name) {
        var full_name = `${middle_name} ${last_name}`;
        req.body.full_name = full_name;
      } else if (first_name && last_name) {
        var full_name = `${first_name} ${last_name}`;
        req.body.full_name = full_name;
      } else if (first_name) {
        var full_name = first_name;
        req.body.full_name = full_name;
      } else if (middle_name) {
        var full_name = middle_name;
        req.body.full_name = full_name;
      } else if (last_name) {
        var full_name = last_name;
        req.body.full_name = full_name;
      }
      const employee = await UserModel.findByIdAndUpdate(
        { _id: user_id },
        req.body,
        { new: true }
      );
      if (employee == null) {
        return res.status(404).json({
          status: false,
          message: `User Not Found With ID :- ${user_id} `,
          employee,
        });
      }
      return res
        .status(200)
        .json({ status: true, message: "User Updated Successfully" });
    } catch (err) {
      return res.status(500).json({
        status: false,
        message: "Server Error",
        error: err.message || err.toString(),
      });
    }
  },
  updateUserStatus: async (req, res) => {
    try {
      const { user_id, is_active } = req.params;
      const employee = await UserModel.findByIdAndUpdate(
        user_id,
        { $set: { is_active: is_active } },
        { new: true }
      );
      if (employee == null) {
        return res.status(404).json({
          status: false,
          message: `User Not Found With ID :- ${user_id} `,
        });
      }
      return res.status(200).json({
        status: true,
        message: "User Status Updated Successfully",
        employee,
      });
    } catch (err) {
      return res.status(500).json({
        status: false,
        message: "Server Error",
        error: err.message || err.toString(),
      });
    }
  },
  deleteUser: async (req, res) => {
    try {
      const { user_id } = req.params;
      const employee = await UserModel.findByIdAndDelete({ _id: user_id });
      if (employee == null) {
        return res.status(404).json({
          status: false,
          message: `User Not Found With ID :- ${user_id} `,
        });
      }
      return res
        .status(200)
        .json({ status: true, message: "User Deleted Successfully" });
    } catch (err) {
      return res.status(500).json({
        status: false,
        message: "Server Error",
        error: err.message || err.toString(),
      });
    }
  },

  deleteAllUser: async (req, res) => {
    try {
      // Use Mongoose's deleteMany function to delete all records from the collection
      const result = await UserModel.deleteMany({ role: "STUDENT" });

      res.status(200).json({
        status: true,
        message: "All records deleted successfully",
        result,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        error: "Error deleting records",
        details: error.message,
      });
    }
  },
};
