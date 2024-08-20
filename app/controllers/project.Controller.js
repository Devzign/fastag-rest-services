const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const projectModel = require('../models/projectSchema');
const __res_ = require('../../app/utils/helpers/send-response')
const adminModel = require('../models/adminSchema')
const projectController = {
    addProject: async (req, res) => {
        try {
            const project = req.body;
            const { adminId } = req.params
            if (!mongoose.Types.ObjectId.isValid(adminId)){
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 400,
                    message:"Invalid ID. Please provide a valid Admin ID. "

                })
            }
            const existingAdmin = await adminModel.findById(adminId);
            if (!existingAdmin) {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 404,
                    message: 'Admin not found!',
                });
            }
            const existingProject = await projectModel.findOne({ ProjectName: project.ProjectName });
            if (existingProject) {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 400,
                    message: 'Project name already exists!',
                });
            }
            project.adminId = adminId;
            const newProject = new projectModel(project);

            const userProject = await newProject.save();
            if (userProject) {
                return __res_.out(req, res, {
                    status: true,
                    statusCode: 200,
                    message: "Added Successfully!!",
                    data: userProject,
                    adminId:adminId
                });
            }
        } catch (e) {
            console.log(e);
            if (e.name === "ValidationError" || e.name === "CastError") {
                let errorMessage = '';
                for (const key in e.errors) {
                    errorMessage += e.errors[key].message + ". ";
                }
                return __res_.out(req, res, {
                    status: true,
                    statusCode: 400,
                    message: e.name,
                    data: errorMessage
                });
            } else {
                return __res_.out(req, res, {
                    status: true,
                    statusCode: 500,
                    message: "Internal server error!!!",
                    data: e
                });
            }
        }
    },
    updateProject: async (req, res) => {
        try {
            const { adminId, projectId } = req.params;
            const body = req.body;

            console.log(`Received update request for project ID: ${projectId} by admin ID: ${adminId}`);

            if (!mongoose.Types.ObjectId.isValid(adminId) || !mongoose.Types.ObjectId.isValid(projectId)) {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 400,
                    message: "Invalid Admin ID or Project ID.",
                });
            }

            const existingAdmin = await adminModel.findById(adminId);
            if (!existingAdmin) {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 404,
                    message: 'Admin not found!',
                });
            }

            const updatedProject = await projectModel.findByIdAndUpdate(projectId, { $set: body }, { new: true });

            if (updatedProject) {
                return __res_.out(req, res, {
                    status: true,
                    statusCode: 200,
                    message: "Project Updated Successfully!!",
                    result: updatedProject,
                });
            } else {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 404,
                    message: "Update Failed. Project not found.",
                });
            }
        } catch (e) {
            console.error('Error updating project:', e);

            if (e.name === "ValidationError" || e.name === "CastError") {
                let errorMessage = '';
                for (const key in e.errors) {
                    errorMessage += e.errors[key].message + ". ";
                }
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 400,
                    message: e.name,
                    data: errorMessage,
                });
            } else {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 500,
                    message: "Internal server error!!!",
                    data: e,
                });
            }
        }
    },
    deleteProject: async function (req, res) {
        try {
            const id = req.params.id;
            if (ObjectId.isValid(id)) {
                const result = await projectModel.findByIdAndDelete(id);
                if (!result) {
                    return __res_.out(req, res, {
                        status: true,
                        statusCode: 404,
                        message: "Project Record not found!!",
                    });
                }
                return __res_.out(req, res, {
                    status: true,
                    statusCode: 200,
                    message: "Project Deleted Successfully.",
                });
            } else {
                return __res_.out(req, res, {
                    status: "error",
                    statusCode: 400,
                    message: "Invalid Project ID.",
                });
            }
        } catch (e) {
            console.log(e);
            if (e.name === "ValidationError" || e.name === "CastError") {
                let errorMessage = '';
                for (const key in e.errors) {
                    errorMessage += e.errors[key].message + ". ";
                }
                return __res_.out(req, res, {
                    status: true,
                    statusCode: 400,
                    message: e.name,
                    data: errorMessage,
                });
            } else {
                return __res_.out(req, res, {
                    status: true,
                    statusCode: 500,
                    message: "Internal server error!!!",
                    data: e,
                });
            }
        }
    },
    getProjectById: async function (req, res) {
        try {
            const id = req.params.id;
            if (ObjectId.isValid(id)) {
                const project = await projectModel.findById(id);
                if (!project) {
                    return __res_.out(req, res, {
                        status: true,
                        statusCode: 404,
                        message: "Project not found.",
                    });
                } else {
                    return __res_.out(req, res, {
                        status: true,
                        statusCode: 200,
                        message: "Project retrieved successfully!",
                        result: project,
                    });
                }
            } else {
                return __res_.out(req, res, {
                    status: "error",
                    statusCode: 400,
                    message: "Invalid Project ID.",
                });
            }
        } catch (e) {
            if (e.name === "ValidationError" || e.name === "CastError") {
                let errorMessage = '';
                for (const key in e.errors) {
                    errorMessage += e.errors[key].message + ". ";
                }
                return __res_.out(req, res, {
                    status: true,
                    statusCode: 400,
                    message: e.name,
                    data: errorMessage,
                });
            } else {
                return __res_.out(req, res, {
                    status: true,
                    statusCode: 500,
                    message: "Internal server error!!!",
                    data: e,
                });
            }
        }
    },
    getAllProjects: async function (req, res) {
        try {
            const projects = await projectModel.find({}).sort({updatedAt:-1});
            return __res_.out(req, res, {
                status: true,
                statusCode: 200,
                message: "All projects retrieved successfully!",
                result: projects,
            });
        } catch (e) {
            console.log(e);
            if (e.name === "ValidationError" || e.name === "CastError") {
                let errorMessage = '';
                for (const key in e.errors) {
                    errorMessage += e.errors[key].message + ". ";
                }
                return __res_.out(req, res, {
                    status: true,
                    statusCode: 400,
                    message: e.name,
                    data: errorMessage,
                });
            } else {
                return __res_.out(req, res, {
                    status: true,
                    statusCode: 500,
                    message: "Internal server error!!!",
                    data: e,
                });
            }
        }
    }

};

module.exports = projectController;
