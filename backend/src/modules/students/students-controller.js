const asyncHandler = require("express-async-handler");
const { getAllStudents, addNewStudent, getStudentDetail, setStudentStatus, updateStudent, deleteStudent } = require("./students-service");

const handleGetAllStudents = asyncHandler(async (req, res) => {
    const filter = {
        name: req.query.name,
        className: req.query.class,
        section: req.query.section,
        roll: req.query.roll
    };
    const students = await getAllStudents(filter);
    res.json({ students });
});

const handleAddStudent = asyncHandler(async (req, res) => {
    const payload = req.body;
    const result = await addNewStudent(payload);
    res.json(result);
});

const handleUpdateStudent = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const payload = { ...req.body, id };
    const result = await updateStudent(payload);
    res.json(result);
});

const handleGetStudentDetail = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const student = await getStudentDetail(id);
    res.json(student);
});

const handleStudentStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const { id: reviewerId } = req.user;
    
    const result = await setStudentStatus({
        userId: Number(id),
        reviewerId,
        status
    });
    res.json(result);
});

const handleDeleteStudent = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await deleteStudent(id);
    res.json(result);
});

module.exports = {
    handleGetAllStudents,
    handleGetStudentDetail,
    handleAddStudent,
    handleStudentStatus,
    handleUpdateStudent,
    handleDeleteStudent,
};
