const TeacherRequest = require("../models/teacherRequest");
const User = require("../models/User");

const getRequests = async (req, res) => {
  try {
    const requests = await TeacherRequest.findAll();
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const approveRequest = async (req, res) => {
  try {
    const { requestId } = req.body;

    const request = await TeacherRequest.findByPk(requestId);
    if (!request) {
      return res.status(404).json({ error: "Заявка не найдена" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ error: "Заявка уже обработана" });
    }

    const newTeacher = await User.create({
      username: request.username,
      email: request.email,
      password: request.password,
      role: "teacher",
      approved: true,
    });

    await request.update({ status: "approved" });

    res.json({ message: "Заявка одобрена, преподаватель добавлен" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const rejectRequest = async (req, res) => {
  try {
    const { requestId } = req.body;
    const request = await TeacherRequest.findByPk(requestId);

    if (!request) return res.status(404).json({ error: "Заявка не найдена" });

    await request.update({ status: "rejected" });

    res.json({ message: "Заявка отклонена" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getRequests, approveRequest, rejectRequest };
