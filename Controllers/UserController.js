const UserModel = require("../Models/UserModel");
const bcrypt = require("bcryptjs");

module.exports = {
  addUser: async (req, res) => {
    try {
      let {
        first_name,
        middle_name,
        last_name,
        marks,
        total_marks,
        std,
        percentage,
      } = req.body;
      if (!first_name || !last_name || !std) {
        return res
          .status(400)
          .json({ status: false, message: "Required fields are missing" });
      }

      if (!percentage) {
        if (!marks || !total_marks) {
          return res
            .status(400)
            .json({
              status: false,
              message: "Marks and Total Marks are Required",
            });
        }
        percentage = (marks / total_marks) * 100;
      }

      const full_name = middle_name
        ? `${first_name} ${middle_name} ${last_name}`
        : `${first_name} ${last_name}`;
      const user = await UserModel.findOne({ full_name });

      if (user) {
        return res
          .status(400)
          .json({ status: true, message: "User already registered" });
      }

      const userData = new UserModel({
        role: "STUDENT",
        first_name,
        middle_name,
        last_name,
        full_name,
        marks,
        total_marks,
        std,
        percentage,
      });

      await userData.save();

      return res.status(201).json({ message: "User registered Successfully" });
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

      const order = [
        "UKG",
        "LKG",
        "JKG",
        "SKG",
        "1st",
        "2nd",
        "3rd",
        "4th",
        "5th",
        "6th",
        "7th",
        "8th",
        "9th",
        "10th",
        "11th-Com",
        "11th-Sci",
        "11th-Art",
        "12th-Art",
        "12th-Com",
        "12th-Sci",
      ];

      const orderedUserData = order.reduce((acc, std) => {
        if (userData[std]) {
          acc[std] = userData[std];
        }
        return acc;
      }, {});

      return res.status(200).json({
        status: true,
        message: "Student Get Successfully",
        userData: orderedUserData,
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
